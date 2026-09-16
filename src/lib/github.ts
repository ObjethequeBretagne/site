import { env } from "cloudflare:workers";

// Écriture dans le dépôt via l'API GitHub, même principe que back142 et /hibou :
// l'admin commit sur la branche, et le push relance le déploiement.

export interface FichierACommiter {
  chemin: string; // chemin dans le dépôt, ex. public/statuts.pdf
  contenu: Uint8Array | null; // null = suppression
}

async function gh<T>(chemin: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/${chemin}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "objetheque-admin",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} sur ${chemin} : ${await res.text()}`);
  return res.json() as Promise<T>;
}

const branche = () => env.GITHUB_BRANCH ?? "cloudflare/workers-autoconfig";

function versBase64(octets: Uint8Array): string {
  let binaire = "";
  for (let i = 0; i < octets.length; i += 0x8000) {
    binaire += String.fromCharCode(...octets.subarray(i, i + 0x8000));
  }
  return btoa(binaire);
}

// Lu depuis GitHub et non depuis le build : après un enregistrement, l'admin montre
// la nouvelle version sans attendre la fin du redéploiement.
export async function lireJson<T>(chemin: string): Promise<{ donnees: T; sha: string }> {
  const fichier = await gh<{ content: string; sha: string }>(
    `contents/${chemin}?ref=${encodeURIComponent(branche())}`,
  );
  const octets = Uint8Array.from(atob(fichier.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
  return { donnees: JSON.parse(new TextDecoder().decode(octets)), sha: fichier.sha };
}

export async function listerDossier(chemin: string): Promise<string[]> {
  try {
    const entrees = await gh<{ name: string }[]>(`contents/${chemin}?ref=${encodeURIComponent(branche())}`);
    return entrees.map((e) => e.name);
  } catch {
    return []; // dossier pas encore créé
  }
}

// Un seul commit pour tous les fichiers. La ref est mise à jour sans force : si
// quelqu'un a poussé entre-temps, GitHub refuse au lieu d'écraser.
export async function commiter(fichiers: FichierACommiter[], message: string): Promise<void> {
  const ref = await gh<{ object: { sha: string } }>(`git/ref/heads/${branche()}`);
  const parent = await gh<{ tree: { sha: string } }>(`git/commits/${ref.object.sha}`);

  const tree = await Promise.all(
    fichiers.map(async ({ chemin, contenu }) => ({
      path: chemin,
      mode: "100644",
      type: "blob",
      sha: contenu
        ? (await gh<{ sha: string }>("git/blobs", {
            method: "POST",
            body: JSON.stringify({ content: versBase64(contenu), encoding: "base64" }),
          })).sha
        : null,
    })),
  );

  const nouvelArbre = await gh<{ sha: string }>("git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const commit = await gh<{ sha: string }>("git/commits", {
    method: "POST",
    body: JSON.stringify({ message, tree: nouvelArbre.sha, parents: [ref.object.sha] }),
  });
  await gh(`git/refs/heads/${branche()}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
}

export const jsonEnOctets = (donnees: unknown) =>
  new TextEncoder().encode(JSON.stringify(donnees, null, 2) + "\n");

// « Compte rendu AG 2027 » → compte-rendu-ag-2027, puis un suffixe si le nom est pris.
export function nomLibre(texte: string, extension: string, pris: Set<string>): string {
  const base =
    texte
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "fichier";
  let nom = `${base}${extension}`;
  for (let i = 2; pris.has(nom); i++) nom = `${base}-${i}${extension}`;
  pris.add(nom);
  return nom;
}
