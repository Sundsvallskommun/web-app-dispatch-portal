import me from '../fixtures/me';

describe('Login', () => {
  it('sends you to the login screen when unauthorized', () => {
    cy.intercept('GET', '**/api/admin/me', {
      statusCode: 401,
      body: { message: 'AUTH_FAILED' },
    });
    cy.intercept('**/api/saml/**/*', (req) => {
      req.destroy();
    }).as('login');

    cy.visit('/');
    cy.contains('Administration för');

    cy.intercept('GET', '**/api/admin/me', me);

    cy.get('[data-cy="loginButton"]').click();

    cy.wait('@login').then(() => {
      cy.visit('/');
    });
    cy.contains('Välkommen');

    cy.get('button[data-cy="user-menu-button"]').click();
    cy.get('a[data-cy="logout-button"]').should('exist');
  });
});
