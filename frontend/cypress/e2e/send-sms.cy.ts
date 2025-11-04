describe('Send SMS flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.intercept('POST', '**/api/sms', { fixture: 'sms.json' }).as('sms');
    cy.viewport('macbook-16');
    cy.visit('/send/sms');
  });

  it('should add a phone number', () => {
    addPhoneNumber('076-11 22 333');
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="phone-numbers"]').contains('+46 76-112 23 33').should('exist');
  });

  it('should remove a phone number', () => {
    addPhoneNumber('076-11 22 333');
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="phone-numbers"]').contains('+46 76-112 23 33').should('exist');
    cy.get('[data-cy="phone-numbers"]').find('[data-cy="delete-number-button"]').first().click();
    cy.get('[data-cy="phone-numbers"]').should('not.exist');
  });

  it('should show validation error if the phone number format is incorrect', () => {
    addPhoneNumber('07011223334');
    cy.get('[data-cy="form-error-message"]')
      .should('be.visible')
      .and('contain.text', 'Formatet på telefonnumret är felaktigt');
  });

  it('should show validation error if no message is added', () => {
    addPhoneNumber('076-11 22 333');
    cy.get('[data-cy="phone-numbers"]').should('exist');
    cy.get('[data-cy="send-sms-button"]').click();
    cy.get('[data-cy="form-error-message"]').should('be.visible').and('contain.text', 'Meddelandet får inte vara tomt');
  });

  it('should send sms and show success view', () => {
    addPhoneNumber('076-82 73 428');
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
