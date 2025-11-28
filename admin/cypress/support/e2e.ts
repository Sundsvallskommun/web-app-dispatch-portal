import '@cypress/code-coverage/support';

import { CookieConsentUtils } from '@sk-web-gui/react';
import me from '../fixtures/me';
import { logotypes } from 'cypress/fixtures/logotypes';
import { organizations } from 'cypress/fixtures/organizations';
import { municipalities } from 'cypress/fixtures/municipalities';

export const DEFAULT_COOKIE_VALUE = 'necessary%2Cstats';

localStorage.clear();

beforeEach(() => {
  cy.visit('/', { failOnStatusCode: false });
  cy.on('uncaught:exception', () => {
    return false;
  });

  cy.setCookie(CookieConsentUtils.defaultCookieConsentName, DEFAULT_COOKIE_VALUE);
  cy.viewport('macbook-16');
  cy.intercept('GET', '**/api/admin/me', me).as('me');
  cy.intercept('GET', '**/api/admin/logotypes', logotypes).as('logotypes');
  cy.intercept('GET', '**/api/admin/organizations', organizations).as('organizations');
  cy.intercept('GET', '**/api/admin/municipalities', municipalities).as('municipalities');
});
