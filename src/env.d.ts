/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare const __BUILD_TIME__: number; // défini dans astro.config.mjs

// Variables du Worker : secrets (`wrangler secret put`, `.dev.vars` en local)
// et [vars] de wrangler.toml. Déclarées ici plutôt que via @cloudflare/workers-types,
// le site n'ayant besoin de rien d'autre du runtime.
declare module "cloudflare:workers" {
  export const env: {
    ADMIN_PASSWORD?: string;
    GITHUB_TOKEN?: string;
    GITHUB_OWNER?: string;
    GITHUB_REPO?: string;
    GITHUB_BRANCH?: string;
  };
}
