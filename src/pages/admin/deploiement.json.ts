import type { APIRoute } from "astro";
import { dernierCommit } from "../../lib/github";

export const prerender = false;

// Le site est-il en retard sur le dépôt ? Un enregistrement de l'admin n'est visible
// qu'une fois le build relancé par le commit terminé. Un commit postérieur au build
// qui répond n'y est donc pas encore : déploiement en cours. Rien à stocker, et ça
// vaut aussi pour un push fait depuis un poste.
const ECHEC_APRES = 10 * 60 * 1000; // au-delà, le build a sans doute échoué

export const GET: APIRoute = async () => {
  try {
    const { date, message } = await dernierCommit();
    const commitA = Date.parse(date);
    const enCours = commitA > __BUILD_TIME__;
    return Response.json({ ok: true, enCours, echec: enCours && Date.now() - commitA > ECHEC_APRES, date, message });
  } catch {
    // GitHub injoignable : on ne prétend ni que c'est en cours, ni que c'est terminé.
    return Response.json({ ok: false });
  }
};
