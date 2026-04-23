import { Pages } from './types';
import { recipient } from '../fixtures/recipient';
import { recipientcsv } from 'cypress/fixtures/recipientcsv';

const pages = [
  { route: '/send/mail', description: 'Send letter flow' },
  { route: '/send/rek-mail', description: 'Send recommended letter flow' },
] as Pages[];

const personalNumber = { isEligible: '19901118-2475', isNotEligible: '19230101-0159', invalid: '20240101-0000' };

pages.forEach((p) => {
  describe(p.description, () => {
    beforeEach(() => {
      cy.visit(p.route);
    });

    describe('Recipient handler', () => {
      const eligiblePn = personalNumber.isEligible.replace('-', '');
      const notEligiblePn = personalNumber.isNotEligible.replace('-', '');
      const invalidPn = personalNumber.invalid.replace('-', '');

      if (p.route === '/send/mail') {
        // VANLIGT BREV

        it('should add a correct personal number with Kivra in the search input, show dialog and add a person on enter', () => {
          cy.intercept('POST', '**/api/recipient?*', recipient(eligiblePn, 'DIGITAL_MAIL')).as('recipient');
          addRecipient(eligiblePn, true);
          cy.get('[data-cy="recipient-table"]>tbody>tr')
            .eq(0)
            .children()
            .each((child, index) => {
              if (index === 0) cy.wrap(child).contains(personalNumber.isEligible);
              if (index === 2) cy.wrap(child).contains('Digitalt');
            });
        });

        it('should add a correct personal number without Kivra in the search input, show dialog and add a person on enter', () => {
          cy.intercept('POST', '**/api/recipient?*', recipient(notEligiblePn, 'SNAIL_MAIL')).as('recipient');
          addRecipient(notEligiblePn, true);
          cy.get('[data-cy="recipient-table"]>tbody>tr')
            .eq(0)
            .children()
            .each((child, index) => {
              if (index === 0) cy.wrap(child).contains(personalNumber.isNotEligible);
              if (index === 2) cy.wrap(child).contains('Post');
            });
        });

        it('should add a minor personal number, show dialog with error message', () => {
          cy.intercept('POST', '**/api/recipient?*', recipient(notEligiblePn, 'DELIVERY_NOT_POSSIBLE', true)).as(
            'recipient'
          );
          addRecipient(notEligiblePn, false);
          cy.get('[data-cy="preview-person-error"]').should('include.text', 'Mottagaren är underårig');
        });

        it('should add persons with address', () => {
          addAddress();
          cy.get('[data-cy="recipient-table"]>tbody>tr')
            .eq(0)
            .children()
            .each((child, index) => {
              if (index === 0) cy.wrap(child).contains('Manuel Manuelsson');
              if (index === 2) cy.wrap(child).contains('Post');
            });
        });

        it('should add persons from csv', () => {
          addCsv();
          cy.get('[data-cy="recipientlist"]').contains('personal-numbers.csv').should('be.visible');
        });

        it('should show error when adding a bad csv file', () => {
          cy.intercept('POST', '**/api/recipient/csv', recipientcsv('BAD')).as('csv');
          addCsv();
          cy.get('[data-cy="recipientlist"]').should('not.exist');
          cy.get('.sk-form-error-message').contains('Felaktig CSV-fil');
        });

        it('should show error when adding a csv file with no valid recipients', () => {
          cy.intercept('POST', '**/api/recipient/csv', recipientcsv('BAD', { error: 'MISSING_VALID_IDS' })).as('csv');
          addCsv();
          cy.get('[data-cy="recipientlist"]').should('not.exist');
          cy.get('.sk-form-error-message').contains('Kunde inte hitta några giltiga mottagare.');
        });

        it('should show dialog when adding a csv file with duplicate recipients', () => {
          cy.intercept('POST', '**/api/recipient/csv', recipientcsv('OK', { duplicates: true, rejections: true })).as(
            'csv'
          );
          addCsv();
          cy.get('.sk-modal-dialog.sk-dialog')
            .eq(0)
            .within(() => {
              cy.get('h1').should('include.text', 'Filen innehåller problem');
              cy.get('p').contains('Filen innehåller 2 personnummer med dubbletter.');
              cy.get('p').contains('Filen innehåller 2 felaktiga personnummer.');
              cy.get('button').contains('Fortsätt ändå').click();
            });
          cy.get('[data-cy="recipientlist"]').contains('personal-numbers.csv').should('be.visible');
        });

        it('should warn and reset if changing to csv from added person', () => {
          cy.intercept('POST', '**/api/recipient?*', recipient(notEligiblePn, 'SNAIL_MAIL')).as('recipient');
          addRecipient(notEligiblePn, true);
          cy.get('input[type="radio"][value="1"]').check();
          cy.get('.sk-modal-wrapper')
            .first()
            .within(() => {
              cy.get('h1').should('have.text', 'Vill du lägga till mottagare med mottagarlista?');
              cy.get('button').contains('Ja').click();
            });
          cy.get('button').contains('Nästa').click();
          cy.get('[data-cy="form-error-message"]').contains('Du måste lägga till en fil');
        });

        it('should warn and reset if changing to person from added csv', () => {
          addCsv();
          cy.get('input[type="radio"][value="0"]').check();
          cy.get('.sk-modal-wrapper')
            .first()
            .within(() => {
              cy.get('h1').should('have.text', 'Vill du lägga till mottagare med personnummer eller adress?');
              cy.get('button').contains('Ja').click();
            });
          cy.get('button').contains('Nästa').click();
          cy.get('[data-cy="form-error-message"]').contains('Du måste lägga till en mottagare');
        });

        it('should navigate to next step if a csv-file is added and "next" is clicked', () => {
          addCsv();
          navigateToAttachmentHandler();
          cy.get('.sk-progress-stepper-step[data-progress="current"]').should('exist').and('contain.text', 'Filer');
        });

        it('should navigate to next step if a manual address is added and "next" is clicked', () => {
          addAddress();
          navigateToAttachmentHandler();
          cy.get('.sk-progress-stepper-step[data-progress="current"]').should('exist').and('contain.text', 'Filer');
        });
      } else {
        // REKOMMENDERAT BREV
        it('should show validation error if test person does not have Kivra', () => {
          cy.intercept('POST', '**/api/recipient?*', recipient(notEligiblePn, 'DELIVERY_NOT_POSSIBLE')).as('recipient');
          addRecipient(notEligiblePn, false);
          cy.get('[data-cy="preview-person"]').should('contain.text', 'Kan inte ta emot via Kivra');
        });

        it('should show success message if test person has Kivra', () => {
          cy.intercept('POST', '**/api/recipient?*', recipient(eligiblePn, 'DIGITAL_MAIL')).as('recipient');
          addRecipient(eligiblePn, false);
          cy.get('[data-cy="preview-person"]').should('contain.text', 'Kan ta emot via Kivra');
        });
      }

      // ALLA
      it('should remove the added person', () => {
        cy.intercept('POST', '**/api/recipient?*', recipient(eligiblePn, 'DIGITAL_MAIL')).as('recipient');
        addRecipient(personalNumber.isEligible, true);
        cy.get('[data-cy="recipient-table"]').should('exist');
        cy.get('[data-cy="recipient-table"]').find('[data-cy="delete-person-button"]').first().click();
        cy.get('[data-cy="recipient-table"]').should('not.exist');
      });

      it('should add an incorrect (too young) personal number in the search input and show dialog', () => {
        cy.intercept('POST', '**/api/recipient?*', recipient(invalidPn, 'DELIVERY_NOT_POSSIBLE')).as('recipient');
        addRecipient(invalidPn, true);
        cy.get('[data-cy="recipient-table"]').should('not.exist');
      });

      it('should navigate to next step if a recipient is added and "next" is clicked', () => {
        cy.intercept('POST', '**/api/recipient?*', recipient(eligiblePn, 'DIGITAL_MAIL')).as('recipient');
        navigateToAttachmentHandler(personalNumber.isNotEligible);
        cy.get('.sk-progress-stepper-step[data-progress="current"]').should('exist').and('contain.text', 'Filer');
      });
    });

    describe('Attachment handler', () => {
      beforeEach(() => {
        const eligiblePn = personalNumber.isEligible.replace('-', '');
        const notEligiblePn = personalNumber.isNotEligible.replace('-', '');
        cy.intercept('POST', '**/api/recipient?*', recipient(eligiblePn, 'DIGITAL_MAIL')).as('recipient');
        const isRecommended = p.route === '/send/rek-mail';
        navigateToAttachmentHandler(isRecommended ? eligiblePn : notEligiblePn);
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
        const eligiblePn = personalNumber.isEligible.replace('-', '');
        cy.intercept('POST', '**/api/recipient?*', recipient(eligiblePn, 'DIGITAL_MAIL')).as('recipient');
        addRecipient(eligiblePn, true);
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

['person', 'address', 'csv'].forEach((variant) => {
  describe(`Review handler - ${variant}`, () => {
    beforeEach(() => {
      cy.visit('/send/mail');
      const eligiblePn = personalNumber.isEligible.replace('-', '');
      if (variant === 'person') {
        cy.intercept('POST', '**/api/recipient?*', recipient(eligiblePn, 'DIGITAL_MAIL')).as('recipient');
        addRecipient(eligiblePn, true);
      } else if (variant === 'address') {
        addAddress();
      } else if (variant === 'csv') {
        addCsv();
      }

      cy.get('[data-cy="next-button"]').click();
      cy.get('[data-cy="file-input"]').selectFile('cypress/files/document1.pdf', { force: true });
      cy.get('[data-cy="next-button"]').click();
      cy.get('[data-cy="sender-subject"]').type('Min rubrik');
      cy.get('[data-cy="next-button"]').click();
    });

    it('should show the correct file and subject', () => {
      cy.get('[data-cy="review-attachments"]').contains('document1.pdf');
      cy.get('[data-cy="review-subject"]>p').should('include.text', 'Min rubrik');
    });

    it(`should show the correct recipients from ${variant}`, () => {
      if (variant !== 'csv') {
        cy.get('[data-cy="recipient-table"]')
          .first()
          .within(() => {
            cy.get('[data-cy="delete-person-button"]').should('not.exist');
            if (variant === 'person') {
              cy.get('[data-cy="person-name"]').should('include.text', 'Person Personsson');
              cy.get('[data-cy="person-number"]').should('include.text', personalNumber.isEligible);
              cy.get('[data-cy="delivery-method"]').should('include.text', 'Digitalt');
            } else {
              cy.get('[data-cy="person-name"]').should('include.text', 'Manuel Manuelsson');
              cy.get('[data-cy="person-number"]').should('not.exist');
              cy.get('[data-cy="delivery-method"]').should('include.text', 'Post');
            }
          });
        cy.get('[data-cy="recipient-file-list"]').should('not.exist');
      } else {
        cy.get('[data-cy="recipient-table"]').should('not.exist');
        cy.get('[data-cy="recipient-file-list"]').contains('personal-numbers.csv');
      }
    });
  });
});

const addAddress = () => {
  cy.get('[data-cy="add-with-address-button"]').click();
  cy.get('[data-cy="add-with-address-modal"]').within(() => {
    cy.get('#firstName').type('Manuel');
    cy.get('#lastName').type('Manuelsson');
    cy.get('#address').type('Gata 1');
    cy.get('#zipCode').type('123 45');
    cy.get('#city').type('Staden{enter}');
  });
};

const addCsv = () => {
  cy.get('input[type="radio"][value="1"]').check();
  cy.get('#file-upload-files').selectFile('cypress/files/personal-numbers.csv', { force: true });
  cy.wait('@csv');
};

const addRecipient = (personNumber: string, enter: boolean) => {
  cy.get('[data-cy="person-search-field"]').should('exist');
  cy.get('[data-cy="person-search-field"]').type(personNumber, { force: true });
  cy.wait('@recipient');
  cy.get('[data-cy="preview-person"]').should('be.visible');
  if (enter) cy.get('[data-cy="person-search-field"]').type('{enter}', { force: true });
};

const navigateToAttachmentHandler = (personNumber?: string) => {
  if (personNumber) {
    addRecipient(personNumber, true);
    cy.get('[data-cy="recipient-table"]').should('exist');
    cy.get('[data-cy="recipient-table"] tbody tr').should('have.length.gte', 1);
  }
  cy.get('[data-cy="next-button"]').click();
};
