const messageId = '00000000-0000-0000-0000-000000000009';

const message = (signingProcessState: string) => ({
  subject: 'Avtal',
  sentAt: '2026-09-25T10:00:00',
  signingStatus: { signingProcessState },
  attachments: [{ attachmentId: 'a1', contentType: 'application/pdf', fileName: 'avtal.pdf' }],
  recipients: [
    { name: 'Signatör 1', email: 'signator1@example.com', status: 'SIGNED' },
    {
      name: 'Signatör 2',
      email: 'signator2@example.com',
      status: signingProcessState === 'SIGNED' ? 'SIGNED' : 'PENDING',
    },
  ],
});

describe('My statistics esigning', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me.json' });
    cy.viewport('macbook-16');
  });

  it('should show the case state in the list and navigate to the details', () => {
    cy.intercept('GET', '**/api/my-statistics', {
      messages: [
        {
          messageId,
          type: 'E_SIGNING',
          subject: 'Avtal',
          sentAt: '2026-09-25T10:00:00',
          signingStatus: { signingProcessState: 'EXPIRED' },
        },
      ],
    });
    cy.intercept('GET', `**/api/my-statistics/${messageId}`, message('EXPIRED'));
    cy.visit('/my-statistics');

    cy.get('[data-cy="my-statistics-list"] a')
      .contains('Avtal (E-signering)')
      .closest('a')
      .should('contain', 'Löpt ut')
      .click();
    cy.location('pathname').should('contain', `/my-statistics/esigning/${messageId}`);
  });

  it('should show pending signatories as expired and disable download when the case has expired', () => {
    cy.intercept('GET', `**/api/my-statistics/${messageId}`, message('EXPIRED'));
    cy.visit(`/my-statistics/esigning/${messageId}`);

    cy.get('[data-cy="esigning-signatory-table"]')
      .should('contain', 'Signerat')
      .and('contain', 'Löpt ut')
      .and('contain', 'signator1@example.com');
    cy.contains('button', 'Ladda ner signerat dokument').should('be.disabled');
  });

  it('should enable download when the case is signed', () => {
    cy.intercept('GET', `**/api/my-statistics/${messageId}`, message('SIGNED'));
    cy.visit(`/my-statistics/esigning/${messageId}`);

    cy.contains('button', 'Ladda ner signerat dokument').should('be.enabled');
  });
});
