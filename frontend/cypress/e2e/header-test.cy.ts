import { Pages } from './types';

const pages = [
  { description: 'Letter', route: '/send/mail' },
  { description: 'Recommended letter', route: '/send/rek-mail' },
  { description: 'Sms', route: '/send/sms' },
] as Pages[];

describe('Header', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.viewport('macbook-16');
  });

  describe('Index', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should contain a header with logo, navigation and user menu', () => {
      cy.get('[data-cy="header"]').should('exist').find('li').should('have.length', 3);
      cy.get('[data-cy="header"] a.sk-link-primary')
        .should('exist')
        .should('have.attr', 'aria-label', 'Postportalen Sundsvalls kommun. Gå till startsidan.');
      cy.get('[data-cy="usermenu"]').should('exist').find('button').first().click();
      cy.get('[data-cy="usermenu"] .sk-popup-menu').should('exist').should('have.attr', 'data-open', 'true');
    });

    it('should show a mobile menu', () => {
      cy.viewport('iphone-6');
      cy.get('[data-cy="header"]').should('exist').find('[data-cy="mobilemenu"]').click();
    });
  });

  pages.map((page) => {
    describe(page.description, () => {
      beforeEach(() => {
        cy.visit(page.route);
      });

      it('should contain a header with cancel button, label and help button', () => {
        cy.get('[data-cy="header"]').should('exist').should('contain.html', 'h4');
        cy.get('[data-cy="cancel-button"] a').should('exist');
        cy.get('[data-cy="help-button"]').should('exist');
      });

      it('should show icons if mobile view', () => {
        cy.viewport('iphone-6');
        cy.get('[data-cy="cancel-button"]').should('exist').find('svg').should('exist');
        cy.get('[data-cy="help-button"]').should('exist');
      });
    });
  });
});
