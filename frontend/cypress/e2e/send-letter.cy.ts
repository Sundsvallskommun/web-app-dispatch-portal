describe('Send a letter', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.intercept('POST', '**/api/recipient', { fixture: 'recipient.json' });
    cy.intercept('GET', '**/api/departments', { fixture: 'departments.json' });
    cy.intercept('GET', '**/api/batchmessages/*', { fixture: 'status.json' }).as('batchMessages');
    cy.intercept('POST', '**/api/message', { fixture: 'message.json' });
    cy.viewport('macbook-16');
    cy.visit('/');
  });

  it('sends two documents to a single person', () => {
    // add main attachment
    cy.get('label[for="attachment"]').selectFile('cypress/files/document1.pdf');
    cy.get('[data-cy="mainAttachment"]').contains('document1.pdf').should('be.visible');

    // add secondary attachment
    cy.get('label[for="attachment"]').selectFile('cypress/files/document2.pdf');
    cy.get('[data-cy="secondaryAttachments"]').contains('document2.pdf').should('be.visible');

    // remove main attachment
    cy.get('[data-cy="mainAttachment"]').find('button[aria-label="Ta bort fil"]').click();
    cy.get('[data-cy="secondaryAttachments"]').should('not.exist');
    // secondary should have become main attachment
    cy.get('[data-cy="mainAttachment"]').contains('document2.pdf').should('be.visible');

    // add new again, should become secondary
    cy.get('label[for="attachment"]').selectFile('cypress/files/document1.pdf');
    cy.get('[data-cy="secondaryAttachments"]').contains('document1.pdf').should('be.visible');

    // Change main attachment
    cy.get('[data-cy="secondaryAttachments"]').find('button').contains('Gör till huvuddokument').click();
    cy.get('[data-cy="mainAttachment"]').contains('document1.pdf');
    cy.get('[data-cy="secondaryAttachments"]').contains('document2.pdf');

    cy.get('button').contains('Nästa').click();

    cy.get('label').contains('Personnummer').type('189001019802{enter}');
    cy.get('table').contains('Personsson, Person');

    cy.get('button').contains('Nästa').click();

    cy.get('label').contains('Förvaltning').click();
    cy.get('select[name="department"]').select('Org Avdelning 2');
    cy.get('label').contains('Ämne').type('Beslut om test');
    cy.get('button').contains('Skicka').click();

    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Skicka post?');
      cy.get('ul').contains('document1.pdf');
      cy.get('ul').contains('document2.pdf');
      cy.get('li').contains('Antal mottagare:').find('strong').should('have.text', '1');
      cy.get('li').contains('Förvaltning:').find('strong').should('have.text', 'Org Avdelning 2');
      cy.get('li').contains('Ämne:').find('strong').should('have.text', 'Beslut om test');

      cy.get('button').contains('Ja').click();
    });

    cy.wait('@batchMessages') .then(() => {
      cy.get('h1').contains('Leveransstatus');
      cy.get('li').contains('strong','Avsändare, förvaltning:').parent().should('include.text', 'Org Avdelning 2');
      cy.get('table[summary="Bilagor"]').contains('document1.pdf');
      cy.get('table[summary="Bilagor"]').contains('document2.pdf');
      cy.get('.sk-label').contains('Papperspost');
    });

    cy.get('a').contains('Gör ett nytt utskick').click();
    cy.get('h1').should('have.text', 'Skicka post. Steg 1: Lägg till textdokument');
  });
});
