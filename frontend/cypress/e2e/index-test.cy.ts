describe('Index page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.viewport('macbook-16');
    cy.visit('/');
  });

  it('should have four boxes for letter, recommended letter, sms and esigning', () => {
    const expectedPaths = ['/send/mail', '/send/rek-mail', '/send/sms', '/send/esigning'];

    cy.get('a.start-link').should('have.length', expectedPaths.length);

    for (const [index, path] of expectedPaths.entries()) {
      cy.get('a.start-link').eq(index).click();
      cy.location('pathname').should('eq', path);
      cy.get('[data-cy="cancel-button"]').click();
      cy.location('pathname').should('equal', '/');
    }
  });
});
