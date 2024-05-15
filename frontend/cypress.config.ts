import { defineConfig } from 'cypress';
import { config } from 'dotenv';
config({ path: `.env` });

export default defineConfig({
  env: {
    apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalRunAllSpecs: true,
    baseUrl: `http://localhost:${process.env.PORT}`,
    video: false,
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
  },
});
