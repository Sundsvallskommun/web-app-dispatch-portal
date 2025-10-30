// @ts-check
import { defineConfig } from 'cypress';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });

export default defineConfig({
  env: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  e2e: {
    baseUrl: `http://localhost:${process.env.PORT || 3000}`,
    experimentalRunAllSpecs: true,
    video: false,
    screenshotOnRunFailure: false,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,

    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});
