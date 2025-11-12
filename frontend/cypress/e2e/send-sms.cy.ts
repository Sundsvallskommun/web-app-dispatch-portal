describe('Send SMS flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.intercept('POST', '**/api/sms', { fixture: 'sms.json' }).as('sms');
    cy.viewport('macbook-16');
    cy.visit('/send/sms');
  });

  it('should add a phone number', () => {
    addPhoneNumber('0701740635');
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="phone-numbers"]').contains('+46701740635').should('exist');
  });

  it('should remove a phone number', () => {
    addPhoneNumber('0701740635');
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="phone-numbers"]').contains('+46701740635').should('exist');
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
      .and('contain.text', 'Formatet på telefonnumret är felaktigt');
  });

  it('should show validation error if no message is added', () => {
    addPhoneNumber('0701740635');
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="send-sms-button"]').click();
    cy.get('[data-cy="form-error-message"]').should('be.visible').and('contain.text', 'Meddelandet får inte vara tomt');
  });

  it('should send sms and show success view', () => {
    addPhoneNumber('0701740635');
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="sms-message-input"]').type(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      { force: true }
    );
    cy.get('[data-cy="send-sms-button"]').click();
  });
});

const addPhoneNumber = (phoneNumber: string) => {
  cy.get('[data-cy="mobile-number-input"]').should('exist');
  cy.get('[data-cy="mobile-number-input"] input').type(phoneNumber, { force: true });
  cy.get('[data-cy="mobile-number-input"] button').click({ force: true });
};
