import { SendTypes } from './types';

describe('My statistics page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.intercept('GET', '**/api/my-statistics', { fixture: 'my-statistics.json' });
    cy.intercept('GET', '**/api/my-rec-letters', { fixture: 'my-rec-letters.json' });
    cy.intercept('GET', '**/api/my-statistics/00000000-0000-0000-0000-000000000007', {
      fixture: 'statistics-sms.json',
    });
    cy.intercept('GET', '**/api/my-statistics/00000000-0000-0000-0000-000000000000', {
      fixture: 'statistics-mail.json',
    });
    cy.intercept('GET', '**/api/my-statistics/00000000-0000-0000-0000-000000000002', {
      fixture: 'statistics-rek-mail.json',
    });
    cy.intercept('GET', '**/api/signing-info/00000000-0000-0000-0000-000000000002', {
      fixture: 'statistics-signing-info.json',
    });
    cy.intercept('GET', '**/api/citizen/00000000-0000-0000-0000-000000000000', {
      fixture: 'citizen.json',
    });
    cy.viewport('macbook-16');
    cy.visit('/my-statistics');
  });

  const sendTypes = [
    { text: 'Rekommenderat brev', uri: '/rek-mail', iconClass: 'lucide-mail-check' },
    { text: 'Brev', uri: '/mail', iconClass: 'lucide-mail' },
    { text: 'Sms', uri: '/sms', iconClass: 'lucide-smartphone' },
  ] as SendTypes[];

  it('should contain a list with list items', () => {
    cy.get('[data-cy="my-statistics-list"]').should('exist').find('a').should('exist');
  });

  it('should show correct icons for each type of item', () => {
    cy.get('[data-cy="my-statistics-list"] a').then(($links) => {
      for (const link of $links) {
        const linkText = link.innerText;
        for (const { text, iconClass } of sendTypes) {
          if (linkText.includes(text)) {
            cy.wrap(link).find(`svg.${iconClass}`).should('exist');
          }
        }
      }
    });
  });

  sendTypes.map((sendType) => {
    it(`should navigate to the "${sendType.text}" item and render content`, () => {
      cy.get('[data-cy="my-statistics-list"] a').contains(sendType.text).click();
      cy.get('[data-cy="send-type-item"]').should('exist');
      cy.location('pathname').should('contain', sendType.uri);
      cy.go('back');
      cy.location('pathname').should('equal', '/my-statistics');
    });
  });
});
