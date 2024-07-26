import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site : "https://objethequebretagne.github.io",
    build: {
    // Exemple : Générer `page.html` au lieu de `page/index.html` pendant la construction.
    format: 'file'
  }
});

  


