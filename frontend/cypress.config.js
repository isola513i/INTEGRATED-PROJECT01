import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173/ssi4',
    baseAPI: 'http://localhost:8080.sit.kmutt.ac.th:8080/itb_mshop',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
  