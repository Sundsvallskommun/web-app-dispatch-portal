describe('Sinlgle letter statistics page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.intercept('GET', '**/api/citizen/00000000-0000-0000-0000-000000000000', {
      fixture: 'citizen.json',
    });
    cy.intercept('GET', '**/api/my-statistics/00000000-0000-0000-0000-000000000002', {
      fixture: 'statistics-rek-mail.json',
    });
    cy.viewport('macbook-16');
    cy.visit('/my-statistics/rek-mail/00000000-0000-0000-0000-000000000002');
  });

  describe('404 - No signing info', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/signing-info/00000000-0000-0000-0000-000000000002', {
        fixture: 'signing-info.json',
        statusCode: 404,
      });
    });

    it('should show a table with one recepient without receipt', () => {
      cy.get('[data-cy="letter-recepient-table"]')
        .should('exist')
        .find('.sk-table-auto-cell')
        .should('contain.text', '19901118-2475');
    });
  });

  describe('Signing info and receipt', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/signing-info/00000000-0000-0000-0000-000000000002', {
        fixture: 'signing-info.json',
      });
      cy.intercept('GET', '**api/receipt/**', (req) => {
        req.reply({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
          },
          fixture: 'Benny-Hill-000000000000-mottagningsbevis.pdf',
        });
      }).as('download');
    });

    it('should show a table with a button that downloads a receipt', () => {
      cy.get('[data-cy="letter-recepient-table"]').should('exist').find('button').click();
      cy.wait('@download').its('response.statusCode').should('eq', 200);
    });
  });
});
