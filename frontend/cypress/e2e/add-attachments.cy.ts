describe('Add files', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.intercept('POST', '**/api/recipient', { fixture: 'recipient.json' });
    cy.intercept('GET', '**/api/departments', { fixture: 'departments.json' });
    cy.intercept('GET', '**/api/batchmessages/*', { fixture: 'status.json' }).as('batchMessages');
    cy.intercept('POST', '**/api/message', { fixture: 'message.json' });
    cy.intercept('GET', '**/me', { fixture: 'me.json' }).as('getMe');
    cy.viewport('macbook-16');
    cy.visit('/send/mail');
  });

  it('should add two documents', () => {
    // add first document
    cy.get('[data-cy="file-input"]').selectFile('cypress/files/document1.pdf', { force: true });
    cy.get('[data-cy="attachments"]').contains('document1.pdf').should('be.visible');

    // add second document
    cy.get('[data-cy="file-input"]').selectFile('cypress/files/document2.pdf', { force: true });
    cy.get('[data-cy="attachments"]').contains('document2.pdf').should('be.visible');
  });

  it('should remove first document', () => {
    // add two documents
    cy.get('[data-cy="file-input"]').selectFile(['cypress/files/document1.pdf', 'cypress/files/document2.pdf'], {
      force: true,
    });

    // remove first document
    cy.get('[data-cy="file-list"]').find('button[aria-label="Ta bort fil"]').first().click();
    cy.get('[data-cy="attachments"]').contains('document2.pdf').should('be.visible');
  });

  it('should handle drag and drop', () => {
    cy.get('[data-cy="attachments"] .drag-handler').then(($items) => {
      expect($items.eq(0)).to.contain('document1.pdf');
      expect($items.eq(1)).to.contain('document2.pdf');
    });
  });
});
