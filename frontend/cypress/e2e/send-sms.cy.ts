import { recipientCsvSms } from 'cypress/fixtures/recipientcsv';

const formatPhoneNumberForUi = (phoneNumber: string): string => {
  return `+46 ${phoneNumber.slice(1, 3)}-${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;
};

describe('Send SMS flow', () => {
  const mockPhoneNumber = Cypress.env('mockPhoneNumber');
  const mockPhoneNumberDisplay = formatPhoneNumberForUi(mockPhoneNumber);

  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.intercept('POST', '**/api/sms', { fixture: 'sms.json' }).as('sendSms');
    cy.intercept('POST', '**/api/csv-sms', { fixture: 'sms.json' }).as('sendSms');
    cy.intercept('POST', '**/api/recipient/csv/sms', recipientCsvSms('OK')).as('csv');
    cy.viewport('macbook-16');
    cy.visit('/send/sms');
  });

  it('should add a phone number', () => {
    addPhoneNumber(mockPhoneNumber);
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="phone-numbers"]').contains(mockPhoneNumberDisplay).should('exist');
  });

  it('should remove a phone number', () => {
    addPhoneNumber(mockPhoneNumber);
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="phone-numbers"]').contains(mockPhoneNumberDisplay).should('exist');
    cy.get('[data-cy="phone-numbers"]').find('[data-cy="delete-number-button"]').first().click();
    cy.get('[data-cy="phone-numbers"]').should('not.exist');
  });

  it('should show a validation message if no phone number is added', () => {
    cy.get('[data-cy="mobile-number-input"]').should('exist').find('button').click({ force: true });
    cy.get('[data-cy="form-error-message"]')
      .should('be.visible')
      .and('contain.text', 'Ange ett mobilnummer med 10 siffror, till exempel 0701234567.');
  });

  it('should show validation error if the phone number format is incorrect', () => {
    addPhoneNumber('070174063');
    cy.get('[data-cy="form-error-message"]')
      .should('be.visible')
      .and('contain.text', 'Formatet på mobilnumret är felaktigt');
  });

  it('should show validation error if no message is added', () => {
    addPhoneNumber(mockPhoneNumber);
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="send-sms-button"]').click();
    cy.get('[data-cy="form-error-message"]').should('be.visible').and('contain.text', 'Meddelandet får inte vara tomt');
  });

  it('should add csv file with recipients', () => {
    addCsv();
    cy.get('[data-cy="recipientlist"]').contains('mobile-numbers.csv').should('be.visible');
  });

  it('should show error when adding a bad csv file', () => {
    cy.intercept('POST', '**/api/recipient/csv/sms', recipientCsvSms('BAD')).as('csv');
    addCsv();
    cy.get('[data-cy="recipientlist"]').should('not.exist');
    cy.get('.sk-form-error-message').contains('Felaktig CSV-fil');
  });

  it('should show error when adding a csv file with no valid recipients', () => {
    cy.intercept('POST', '**/api/recipient/csv/sms', recipientCsvSms('BAD', { error: 'MISSING_VALID_IDS' })).as('csv');
    addCsv();
    cy.get('[data-cy="recipientlist"]').should('not.exist');
    cy.get('.sk-form-error-message').contains('Kunde inte hitta några giltiga mottagare.');
  });

  it('should show dialog when adding a csv file including rejected recipients', () => {
    cy.intercept('POST', '**/api/recipient/csv/sms', recipientCsvSms('OK', { rejections: true })).as('csv');
    addCsv();
    cy.get('.sk-modal-dialog.sk-dialog')
      .eq(0)
      .within(() => {
        cy.get('h1').should('include.text', 'Filen mobile-numbers.csv innehåller 2 ogiltiga mobilnummer.');
        cy.get('p').contains('Vill du fortsätta utan dessa mottagare?');
        cy.get('p').contains('07017406351');
        cy.get('p').contains('07017406352');
        cy.get('button').contains('Fortsätt ändå').click();
      });
    cy.get('[data-cy="recipientlist"]').contains('mobile-numbers.csv').should('be.visible');
  });

  it('should warn and reset if changing to csv from added person', () => {
    addPhoneNumber(mockPhoneNumber);
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="phone-numbers"]').contains(mockPhoneNumberDisplay).should('exist');
    cy.get('input[type="radio"][value="1"]').check();
    cy.get('.sk-modal-wrapper')
      .first()
      .within(() => {
        cy.get('h1').should('have.text', 'Vill du lägga till mottagare med mottagarlista?');
        cy.get('button').contains('Ja').click();
      });
    addMessage();
    cy.get('[data-cy="send-sms-button"]').click();
    cy.get('[data-cy="form-error-message"]').contains('Du måste lägga till en CSV-fil');
  });

  it('should warn and reset if changing to person from added csv', () => {
    addCsv();
    cy.get('input[type="radio"][value="0"]').check();
    cy.get('.sk-modal-wrapper')
      .first()
      .within(() => {
        cy.get('h1').should('have.text', 'Vill du lägga till mottagare med mobilnummer eller adress?');
        cy.get('button').contains('Ja').click();
      });
    addMessage();
    cy.get('[data-cy="send-sms-button"]').click();
    cy.get('[data-cy="form-error-message"]').contains('Du måste lägga till en mottagare.');
  });

  it('should send message if a csv-file is added and "send" is clicked', () => {
    addCsv();
    sendMessage();
    assertSuccessView();
  });

  it('should send message if a manual phone number is added and "send" is clicked', () => {
    addPhoneNumber(mockPhoneNumber);
    sendMessage();
    assertSuccessView();
  });

  it('should send sms and show success view', () => {
    addPhoneNumber(mockPhoneNumber);
    cy.get('[data-cy="phone-numbers"]').should('exist');
    sendMessage();
    assertSuccessView();
  });
});

const addPhoneNumber = (phoneNumber: string) => {
  cy.get('[data-cy="mobile-number-input"]').should('exist');
  cy.get('[data-cy="mobile-number-input"] input').type(phoneNumber, { force: true });
  cy.get('[data-cy="mobile-number-input"] button').click({ force: true });
};

const addCsv = () => {
  cy.get('input[type="radio"][value="1"]').check();
  cy.get('#file-upload-files').selectFile('cypress/files/mobile-numbers.csv', { force: true });
  cy.wait('@csv');
};

const addMessage = () => {
  cy.get('[data-cy="sms-message-input"]').type(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    { force: true }
  );
};

const sendMessage = () => {
  addMessage();
  cy.get('[data-cy="send-sms-button"]').click();
  cy.wait('@sendSms');
};

const assertSuccessView = () => {
  cy.get('[data-cy="send-sms-button"]').should('not.exist');
  cy.contains('h1', 'Ditt sms har skickats').should('be.visible');
  cy.contains('button', 'Skicka nytt sms').should('be.visible');
};
