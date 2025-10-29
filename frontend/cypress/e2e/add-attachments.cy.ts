const pages = ['/send/mail', '/send/rek-mail'];

pages.forEach((page) => {
  describe(`Add files on ${page}`, () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
      cy.intercept('POST', '**/api/recipient', { fixture: 'recipient.json' });
      cy.intercept('GET', '**/api/departments', { fixture: 'departments.json' });
      cy.intercept('GET', '**/api/batchmessages/*', { fixture: 'status.json' }).as('batchMessages');
      cy.intercept('POST', '**/api/message', { fixture: 'message.json' });
      cy.intercept('GET', '**/me', { fixture: 'me.json' }).as('getMe');
      cy.viewport('macbook-16');
    });

    it('should add two documents', () => {
      cy.get('[data-cy="file-input"]').selectFile('cypress/files/document1.pdf', { force: true });
      cy.get('[data-cy="attachments"]').contains('document1.pdf').should('be.visible');

      cy.get('[data-cy="file-input"]').selectFile('cypress/files/document2.pdf', { force: true });
      cy.get('[data-cy="attachments"]').contains('document2.pdf').should('be.visible');
    });

    it('should remove first document', () => {
      cy.get('[data-cy="file-input"]').selectFile(['cypress/files/document1.pdf', 'cypress/files/document2.pdf'], {
        force: true,
      });

      cy.get('[data-cy="file-list"]').find('button[aria-label="Ta bort fil"]').first().click();
      cy.get('[data-cy="attachments"]').contains('document2.pdf').should('be.visible');
    });

    it('should show validation error if no attachment is added', () => {
      cy.get('[data-cy="next-button"]').click();
      cy.get('[data-cy="form-error-message"]').should('be.visible');
    });

    it('should show validation error if attachment is larger than 1.5 MB', () => {
      cy.get('[data-cy="file-input"]').selectFile('cypress/files/document3.pdf', { force: true });
      cy.get('[data-cy="form-error-message"]').should('be.visible');
    });
  });
});
