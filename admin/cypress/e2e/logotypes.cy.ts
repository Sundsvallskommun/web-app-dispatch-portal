import { logotype, logotypesWithNew, newLogotype } from 'cypress/fixtures/logotypes';

describe('Logotypes', () => {
  it('lists logotypes on front page', () => {
    cy.get('[data-cy="resource-card-logotypes"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'Logotyper');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '3 logotyper');
    });
  });
  it('lists and sorts logotypes', () => {
    cy.get('[data-cy="resource-card-logotypes"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('image1.png');
        cy.get('tbody').children().eq(1).contains('image3.png');
        cy.get('tbody').children().eq(2).contains('image5.png');

        cy.get('thead>tr').children().eq(0).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('image5.png');
        cy.get('tbody').children().eq(1).contains('image3.png');
        cy.get('tbody').children().eq(2).contains('image1.png');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 8);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Namn');
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Relativ sökväg');
  });

  it('creates a new logotyp', () => {
    cy.intercept('GET', '**/api/admin/logotypes', logotypesWithNew);
    cy.intercept('GET', '**/api/admin/logotypes/4', newLogotype);
    cy.intercept('POST', '**/api/admin/logotypes', newLogotype).as('save');
    cy.get('[data-cy="mainmenu-resource-logotypes"]>span>button').click();
    cy.contains('Skapa ny logotyp').click();
    cy.get('h1').should('have.text', 'Skapa ny logotyp');
    cy.get('input[type=file]')
      .eq(0)
      .selectFile(
        {
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'image7.png',
          mimeType: 'image/png',
          lastModified: Date.now(),
        },
        { force: true }
      );
    cy.get('input[type=file]')
      .eq(0)
      .selectFile(
        {
          contents: Cypress.Buffer.from('file contents'),
          fileName: 'image8.png',
          mimeType: 'image/png',
          lastModified: Date.now(),
        },
        { force: true }
      );

    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.wait('@save');
    cy.get('h1').should('have.text', 'Redigera logotyp');
    cy.get('header').should('include.text', 'Id: 4');
    cy.get('[data-cy="goback"]').click();
    cy.get('[data-cy="resource-table"]').eq(0).find('tbody').children().should('have.length', 4);
  });

  it('edits a logotype', () => {
    cy.intercept('GET', '**/api/admin/logotypes/1', logotype);
    cy.intercept('PATCH', '**/api/admin/logotypes/1', {
      ...logotype,
      data: { ...logotype?.data, name: 'Nytt namn' },
    });
    cy.get('[data-cy="mainmenu-resource-logotypes"]>span>a').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .find('tbody')
      .children()
      .eq(0)
      .find('a[data-cy="edit-resource"]')
      .click();
    cy.get('h1').should('have.text', 'Redigera logotyp');
    cy.get('header').should('include.text', 'Id: 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-logotypes-name"]').should('have.value', 'image1.png');
    cy.get('[data-cy="edit-logotypes-name"]').clear();
    cy.get('[data-cy="edit-logotypes-name"]').type('Nytt namn');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
  });
});
