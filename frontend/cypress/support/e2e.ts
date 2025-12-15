// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

beforeEach(() => {
  cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
  cy.fixture('my-department.txt', 'utf8').then((text) => {
    cy.intercept('GET', '**/api/my-department', {
      statusCode: 200,
      headers: { 'content-type': 'text/plain; charset=utf8' },
      body: text,
    });
  });
  cy.intercept('POST', '**/api/message', { fixture: 'message.json' });
  cy.intercept('GET', '**/me', { fixture: 'me.json' }).as('getMe');
  cy.viewport('macbook-16');
});
// Alternatively you can use CommonJS syntax:
// require('./commands')
