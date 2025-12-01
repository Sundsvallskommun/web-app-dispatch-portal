import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    // supportFile: false,
    baseUrl: `http://localhost:${process.env.PORT || '3000'}${process.env.NEXT_PUBLIC_BASEPATH || ''}`,
    env: {
      apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    },
    video: false,
    screenshotOnRunFailure: false,
    experimentalRunAllSpecs: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    // retries: 5,
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);

      return config;
    },
  },
});
