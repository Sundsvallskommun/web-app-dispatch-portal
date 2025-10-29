describe('Send mail flow', () => {
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

  describe('Attachment handler', () => {
    it('should add two documents', () => {
      cy.get('[data-cy="file-input"]').selectFile('cypress/files/document1.pdf', { force: true });
      cy.get('[data-cy="attachments"]').contains('document1.pdf').should('be.visible');
      cy.get('[data-cy="file-input"]').selectFile('cypress/files/document2.pdf', { force: true });
      cy.get('[data-cy="attachments"]').contains('document2.pdf').should('be.visible');
    });

    it('should add two documents and remove first document', () => {
      cy.get('[data-cy="file-input"]').selectFile(['cypress/files/document1.pdf', 'cypress/files/document2.pdf'], {
        force: true,
      });
      cy.get('[data-cy="file-list"]').find('[data-cy="delete-file-button"]').first().click();
      cy.get('[data-cy="attachments"]').contains('document2.pdf').should('be.visible');
    });

    it('should show validation error when no documents are added and "next" is clicked', () => {
      cy.get('[data-cy="next-button"]').click();
      cy.get('[data-cy="form-error-message"]').should('be.visible');
    });

    it('should show validation error when an attachment that is larger than 1.5 MB is added and "next" is clicked', () => {
      cy.get('[data-cy="file-input"]').selectFile('cypress/files/document3.pdf', { force: true });
      cy.get('[data-cy="form-error-message"]').should('be.visible');
    });
  });
});
