import '@cypress/code-coverage/support';

import { CookieConsentUtils } from '@sk-web-gui/react';
import me from '../fixtures/me';
import { apiResponse } from 'cypress/fixtures/apiresponse';
import { idp1, idp2 } from 'cypress/fixtures/idps';
import { host1, host2, host3 } from 'cypress/fixtures/hosts';

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
  cy.intercept('GET', '**/api/admin/hosts', apiResponse([host1, host2, host3])).as('hosts');
  cy.intercept('GET', '**/api/admin/idps', apiResponse([idp1, idp2])).as('organizations');
});
