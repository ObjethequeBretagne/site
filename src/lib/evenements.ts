// Règles de lecture des titres HelloAsso, partagées par les composants qui
// lisent `public/events.json` (agenda de créneaux, prochains événements,
// calendrier mensuel).

/**
 * Les titres saisis sur HelloAsso varient (accents, majuscules, espaces
 * en trop) : on compare toujours sur une version normalisée.
 */
export function normalise(str: string): string {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

/**
 * Convention de nommage des créneaux sur HelloAsso : le titre **commence** par
 * le libellé du créneau, ce qui suit est libre — c'est là que se mettent les
 * dates. « Espace Bricolage - Réservation 18/07 », « Couture autonomie 22/09 ».
 */
export function commencePar(titre: string, prefixe: string): boolean {
  return normalise(titre).startsWith(normalise(prefixe));
}

/**
 * Créneaux de réservation récurrents : ils ont leur propre agenda sur la page
 * concernée et n'encombrent donc ni la liste des prochains événements ni le
 * calendrier mensuel.
 */
export const CRENEAUX_RECURRENTS = [
  "espace bricolage",
  "couture accompagnée",
  "couture autonomie",
];

export function estCreneauRecurrent(titre: string): boolean {
  return CRENEAUX_RECURRENTS.some((prefixe) => commencePar(titre, prefixe));
}
