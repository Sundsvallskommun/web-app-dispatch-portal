import { apiResponse } from 'cypress/fixtures/apiresponse';
import { logotype1, logotype2, logotypeFile, newLogotype } from '../fixtures/logotypes';

describe('Logotypes', () => {
  it('lists logotypes on front page', () => {
    cy.get('[data-cy="resource-card-logotypes"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'Logotyper');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '2 logotyper');
    });
  });
  it('lists and sorts logotypes', () => {
    cy.get('[data-cy="resource-card-logotypes"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('logotyp1');
        cy.get('tbody').children().eq(1).contains('logotyp2');

        cy.get('thead>tr').children().eq(0).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('logotyp2');
        cy.get('tbody').children().eq(1).contains('logotyp1');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 7);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Värd');
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Visningsnamn');
  });

  it('creates a new logotype', () => {
    cy.intercept('GET', '**/api/admin/logotypes', apiResponse([logotype1, logotype2, newLogotype]));
    cy.intercept('GET', '**/api/admin/logotypes/3', apiResponse(newLogotype));
    cy.intercept('POST', '**/api/admin/logotypes', apiResponse(newLogotype)).as('save');
    cy.get('[data-cy="mainmenu-resource-logotypes"]>span>button').click();
    cy.contains('Skapa ny logotyp').click();
    cy.get('h1').should('have.text', 'Skapa ny logotyp');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-logotype-host"]').type('ny');
    cy.get('[data-cy="edit-logotype-display_name"]').type('Ny kommun');

    cy.get('input[type=file]').eq(0).selectFile(logotypeFile, { force: true });
    cy.get('input[type=file]').eq(1).selectFile(logotypeFile, { force: true });

    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.wait('@save');
  });

  it('edits a logotype', () => {
    cy.intercept('GET', '**/api/admin/logotypes/1', apiResponse(logotype1));
    cy.intercept('PATCH', '**/api/admin/logotypes/1', {
      ...apiResponse(logotype1),
      data: { ...logotype1, name: 'new_name' },
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
    cy.get('[data-cy="edit-logotype-host"]').should('have.value', 'logotyp1');
    cy.get('[data-cy="edit-logotype-host"]').clear();
    cy.get('[data-cy="edit-logotype-host"]').type('new_name');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
  });
});
