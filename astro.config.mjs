import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://objethequecornouaille.fr",

  build: {
    inlineStylesheets: 'always',
  },

  // Heure du build, comparée à celle du dernier commit par /admin/deploiement.json.
  vite: {
    define: { __BUILD_TIME__: JSON.stringify(Date.now()) },
  },

  adapter: cloudflare({
    imageService: 'compile'
  })
});