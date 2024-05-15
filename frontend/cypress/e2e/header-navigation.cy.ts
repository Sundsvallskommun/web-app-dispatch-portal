describe('Use main navigation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/me', { fixture: 'me.json' }).as('getMe');
  });

  it('uses the main menu on desktop', () => {
    cy.viewport('macbook-16');
    cy.visit('/');
    cy.get('h1').should('have.text', 'Skicka post. Steg 1: Lägg till textdokument');
    cy.get('nav.sk-header').within(() => {
      cy.get('[data-cy="mainmenu"]').contains('Hjälp').click();
      cy.url().should('include', '/help');
      cy.get('[data-cy="mainmenu"]').contains('Skicka post').click();
      cy.url().should('not.include', '/help');
      cy.get('[data-cy="mainmenu"]').contains('Hjälp').click();
      cy.url().should('include', '/help');
      cy.get('#page-title').click();
      cy.url().should('not.include', '/help');
    });
  });
  it('uses the user menu on desktop', () => {
    cy.viewport('macbook-16');
    cy.visit('/');
    cy.get('[data-cy="usermenu"]').within(($usermenu) => {
      cy.wrap($usermenu).click();
      cy.get('.sk-popup-menu').within(() => {
        cy.get('label').contains('Person Personsson (perper)').should('be.visible');
        cy.get('.sk-popup-menu-item').contains('Logga ut').click();
        cy.url().should('include', '/login');
      });
    });
  });
  it('uses the mobile menu on mobile device', () => {
    cy.viewport('iphone-8');
    cy.visit('/');
    cy.get('[data-cy="usermenu"]').should('not.exist');
    cy.get('[data-cy="mainmenu"]').should('not.exist');

    cy.get('.sk-header-mobilemenu').within(() => {
      cy.get('button[data-cy="mobilemenu"]').click();
      cy.get('div.sk-popup-menu-items').within(($mobilemenu) => {
        cy.wrap($mobilemenu).children().should('have.length', 2);
        cy.contains('Hjälp').click();
      });
      cy.url().should('include', '/help');
      cy.get('button[data-cy="mobilemenu"]').click();
      cy.get('div.sk-popup-menu-items').within(() => {
        cy.contains('Skicka post').click();
      });
      cy.url().should('not.include', '/help');
      cy.get('button[data-cy="mobilemenu"]').click();
      cy.get('div.sk-popup-menu-items').within(() => {
        cy.get('[role="menuitem"]').contains('Logga ut').click();
      });
      cy.url().should('include', '/login');
    });
  });
});
