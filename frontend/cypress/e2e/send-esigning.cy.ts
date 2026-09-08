import { orgRecipient, recipient } from '../fixtures/recipient';

const personalNumber = { first: '199011182475', second: '198501011234' };
const organizationNumber = '5566778899';

describe('Send esigning flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/recipient?*', (req) => {
      req.reply(recipient(req.body?.personNumber ?? '', 'DIGITAL_MAIL'));
    }).as('recipient');
    cy.visit('/send/esigning');
  });

  it('should only allow personal numbers and not preview an organization number', () => {
    cy.intercept('POST', '**/api/org-recipient*', orgRecipient(organizationNumber, 'SNAIL_MAIL')).as('orgRecipient');
    cy.get('.sk-form-label').should('contain.text', 'Sök mottagare med personnummer');
    cy.get('[data-cy="recipient-search-field"]').type(organizationNumber, { force: true });
    cy.get('[data-cy="preview-recipient"]').should('not.exist');
  });

  it('should not allow a signatory to be added until a valid email is given', () => {
    search(personalNumber.first);
    cy.get('[data-cy="preview-recipient"]').contains('Lägg till').should('be.disabled');

    cy.get('[data-cy="signatory-email-input"]').type('inte-en-epost', { force: true });
    cy.get('[data-cy="preview-recipient"]').should('contain.text', 'Ange en giltig e-postadress.');
    cy.get('[data-cy="preview-recipient"]').contains('Lägg till').should('be.disabled');

    cy.get('[data-cy="signatory-email-input"]').type('@exempel.se', { force: true });
    cy.get('[data-cy="preview-recipient"]').contains('Lägg till').should('not.be.disabled');
  });

  it('should add a signatory with name, personal number and email', () => {
    cy.contains('Inga signatörer tillagda än.').should('be.visible');
    addSignatory(personalNumber.first, 'person@exempel.se');

    cy.get('[data-cy="signatory-table"] tbody tr').should('have.length', 1);
    cy.get('[data-cy="signatory-name"]').should('contain.text', 'Person Personsson');
    cy.get('[data-cy="signatory-person-number"]').should('contain.text', '19901118-2475');
    cy.get('[data-cy="signatory-email"]').should('contain.text', 'person@exempel.se');
  });

  it('should not allow the same person to be added twice', () => {
    addSignatory(personalNumber.first, 'person@exempel.se');
    cy.get('[data-cy="recipient-search-field"]').type(personalNumber.first, { force: true });
    cy.wait('@recipient');
    cy.get('.sk-form-error-message').should('contain.text', 'Personen är redan tillagd');
    cy.get('[data-cy="signatory-table"] tbody tr').should('have.length', 1);
  });

  it('should remove an added signatory', () => {
    addSignatory(personalNumber.first, 'person@exempel.se');
    cy.get('[data-cy="signatory-table"]').find('[data-cy="delete-signatory-button"]').first().click();
    cy.get('[data-cy="signatory-table"]').should('not.exist');
  });

  it('should reorder signatories with the arrows', () => {
    addSignatory(personalNumber.first, 'forst@exempel.se');
    addSignatory(personalNumber.second, 'andra@exempel.se');
    expectOrder(['forst@exempel.se', 'andra@exempel.se']);

    cy.get('[data-cy="signatory-table"] tbody tr').eq(0).find('[data-cy="move-signatory-down-button"]').click();
    expectOrder(['andra@exempel.se', 'forst@exempel.se']);

    cy.get('[data-cy="signatory-table"] tbody tr').eq(1).find('[data-cy="move-signatory-up-button"]').click();
    expectOrder(['forst@exempel.se', 'andra@exempel.se']);
  });
});

const search = (personNumber: string) => {
  cy.get('[data-cy="recipient-search-field"]').should('exist');
  cy.get('[data-cy="recipient-search-field"]').type(personNumber, { force: true });
  cy.wait('@recipient');
  cy.get('[data-cy="preview-recipient"]').should('be.visible');
};

const addSignatory = (personNumber: string, email: string) => {
  search(personNumber);
  cy.get('[data-cy="signatory-email-input"]').type(email, { force: true });
  cy.get('[data-cy="preview-recipient"]').contains('Lägg till').click();
  cy.get('[data-cy="preview-recipient"]').should('not.exist');
};

const expectOrder = (emails: string[]) => {
  cy.get('[data-cy="signatory-email"]').should('have.length', emails.length);
  emails.forEach((email, index) => cy.get('[data-cy="signatory-email"]').eq(index).should('contain.text', email));
};
