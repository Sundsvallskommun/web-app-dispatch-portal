import { Pages, PersonNumber } from './types';

const pages = [
  { route: '/send/mail', description: 'Send letter flow' },
  { route: '/send/rek-mail', description: 'Send recommended letter flow' },
] as Pages[];

const personalNumber = { isEligible: '199011182475', isNotEligible: '192301010159' } as PersonNumber;

pages.map((p) => {
  describe(p.description, () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
      cy.intercept('POST', '**/api/recipient', { fixture: 'recipient.json' }).as('recipient');
      cy.intercept('POST', '**/api/recipients', { fixture: 'recipients.json' }).as('recipients');
      cy.intercept('GET', '**/api/departments', { fixture: 'departments.json' });
      cy.intercept('GET', '**/api/batchmessages/*', { fixture: 'status.json' }).as('batchMessages');
      cy.intercept('POST', '**/api/message', { fixture: 'message.json' });
      cy.intercept('GET', '**/me', { fixture: 'me.json' }).as('getMe');
      cy.viewport('macbook-16');
      cy.visit(p.route);
    });

    describe('Recipient handler', () => {
      const eligiblePn = personalNumber.isEligible;
      if (p.route === '/send/mail') {
        it('should add an correct personal number in the search input, show dialog and add a person on enter', () => {
          addRecipient(personalNumber.isNotEligible, true);
        });

        it('should remove an added person', () => {
          addRecipient(personalNumber.isNotEligible, true);
          cy.get('[data-cy="recipient-table"]').should('exist');
          cy.get('[data-cy="recipient-table"]').find('[data-cy="delete-person-button"]').first().click();
          cy.get('[data-cy="recipient-table"]').should('not.exist');
        });

        it('should add persons from csv', () => {
          cy.get('input[type="radio"][value="1"]').check();
          cy.get('[data-cy="file-input"]').selectFile('cypress/files/personal-numbers.csv', { force: true });
          cy.wait('@recipients');
          cy.get('[data-cy="recipients"]').contains('personal-numbers.csv').should('be.visible');
        });
      } else {
        it('should show validation error if test person does not have Kivra', () => {
          addRecipient(personalNumber.isNotEligible, false);
          cy.get('[data-cy="preview-person"]').should('contain.text', 'Kan inte ta emot via Kivra');
        });

        it('should show success message if test person has Kivra', () => {
          addAndCheckEligibility(eligiblePn);
          cy.get('[data-cy="preview-person"]').should('contain.text', 'Kan ta emot via Kivra');
        });

        it('should remove the added person', () => {
          addAndCheckEligibility(eligiblePn);
          cy.get('[data-cy="person-search-field"]').type('{enter}', { force: true });
          cy.get('[data-cy="recipient-table"]').should('exist');
          cy.get('[data-cy="recipient-table"]').find('[data-cy="delete-person-button"]').first().click();
          cy.get('[data-cy="recipient-table"]').should('not.exist');
        });
      }

      it('should navigate to next step if a recipient is added and "next" is clicked', () => {
        if (p.route === '/send/rek-mail') addAndCheckEligibility(eligiblePn);
        navigateToAttachmentHandler(personalNumber.isNotEligible);
        cy.get('.sk-progress-stepper-step[data-progress="current"]').should('exist').and('contain.text', 'Filer');
      });
    });

    describe('Attachment handler', () => {
      beforeEach(() => {
        const isRecommended = p.route === '/send/rek-mail';
        cy.intercept('POST', '**/eligibility-kivra', { fixture: 'kivra.json' }).as('kivra-check');
        navigateToAttachmentHandler(isRecommended ? personalNumber.isEligible : personalNumber.isNotEligible);
      });

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

      it('should navigate to next step if a file is added and "next" is clicked', () => {
        cy.get('[data-cy="file-input"]').selectFile('cypress/files/document1.pdf', { force: true });
        cy.get('[data-cy="attachments"]').should('exist');
        cy.get('[data-cy="next-button"]').click();
        cy.get('.sk-progress-stepper-step[data-progress="current"]')
          .should('exist')
          .and('contain.text', 'Rubrik och förvaltning');
      });
    });

    describe('Sender handler', () => {
      beforeEach(() => {
        cy.intercept('POST', '**/eligibility-kivra', { fixture: 'kivra.json' }).as('kivra-check');
        addRecipient(personalNumber.isEligible, true);
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="file-input"]').selectFile('cypress/files/document1.pdf', { force: true });
        cy.get('[data-cy="next-button"]').click();
      });

      it('should show validation error if no label or management is added - and "next" is clicked', () => {
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="form-error-message"]').should('be.visible');
      });
    });
  });
});

const addRecipient = (personNumber: string, enter: boolean) => {
  cy.get('[data-cy="person-search-field"]').should('exist');
  cy.get('[data-cy="person-search-field"]').type(personNumber, { force: true });
  cy.wait('@recipient');
  cy.get('[data-cy="preview-person"]').should('be.visible');
  if (enter) cy.get('[data-cy="person-search-field"]').type('{enter}', { force: true });
};

const navigateToAttachmentHandler = (personNumber: string) => {
  addRecipient(personNumber, true);
  cy.get('[data-cy="recipient-table"]').should('exist');
  cy.get('[data-cy="recipient-table"] tbody tr').should('have.length.gte', 1);
  cy.get('[data-cy="next-button"]').click();
};

const addAndCheckEligibility = (pn: PersonNumber['isEligible']) => {
  if (pn === personalNumber.isEligible) {
    cy.intercept('POST', '**/eligibility-kivra', { fixture: 'kivra.json' }).as('kivra-check');
  }
  addRecipient(pn, false);
};
