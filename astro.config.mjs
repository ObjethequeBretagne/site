import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://objethequecornouaille.fr",
  build: {
    inlineStylesheets: 'always',
  },
});
