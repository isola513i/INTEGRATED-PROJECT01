import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://ip24ssi4.sit.kmutt.ac.th',
    baseAPI: 'http://ip24ssi4.sit.kmutt.ac.th:8080/itb_mshop',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
