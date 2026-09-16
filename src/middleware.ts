import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";

// /admin est protégé par Basic Auth : le navigateur demande le mot de passe et le
// renvoie à chaque requête. Pas de page de connexion ni de cookie ; on se
// déconnecte en fermant le navigateur. Le nom d'utilisateur est ignoré.
export const onRequest = defineMiddleware((context, next) => {
  if (!context.url.pathname.startsWith("/admin")) return next();

  const attendu = env.ADMIN_PASSWORD;
  if (!attendu) return new Response("ADMIN_PASSWORD non configuré", { status: 500 });

  if (motDePasseRecu(context.request.headers.get("Authorization")) !== attendu) {
    return new Response("Authentification requise", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Objethèque", charset="UTF-8"' },
    });
  }
  return next();
});

function motDePasseRecu(entete: string | null): string {
  const [schema, encode] = (entete ?? "").split(" ");
  if (schema !== "Basic" || !encode) return "";
  try {
    const octets = Uint8Array.from(atob(encode), (c) => c.charCodeAt(0));
    const identifiants = new TextDecoder().decode(octets);
    return identifiants.slice(identifiants.indexOf(":") + 1);
  } catch {
    return "";
  }
}
