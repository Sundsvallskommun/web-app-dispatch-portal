import { apiResponse } from 'cypress/fixtures/apiresponse';
import { idp1, idp2, newIdp } from 'cypress/fixtures/idps';

describe('IDPs', () => {
  it('lists idps on front page', () => {
    cy.get('[data-cy="resource-card-idps"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'IDP');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '2 IDP');
    });
  });
  it('lists and sorts idps', () => {
    cy.get('[data-cy="resource-card-idps"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('testidp 1');
        cy.get('tbody').children().eq(1).contains('testidp 2');

        cy.get('thead>tr').children().eq(0).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('testidp 2');
        cy.get('tbody').children().eq(1).contains('testidp 1');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 6);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Namn');
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Ingångsurl');
  });

  it('creates a new idp', () => {
    cy.intercept('GET', '**/api/admin/idps', apiResponse([idp1, idp2, newIdp]));
    cy.intercept('GET', '**/api/admin/idps/3', apiResponse(newIdp));
    cy.intercept('POST', '**/api/admin/idps', apiResponse(newIdp)).as('save');
    cy.get('[data-cy="mainmenu-resource-idps"]>span>button').click();
    cy.contains('Skapa ny IDP').click();
    cy.get('h1').should('have.text', 'Skapa ny IDP');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-idps-name"]').type('newidp');
    cy.get('[data-cy="edit-idps-entryPoint"]').type('https://nyidp.com/');
    cy.get('[data-cy="edit-idps-idpCert"]').type('123');

    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.wait('@save');
    cy.get('h1').should('have.text', 'Redigera IDP');
    cy.get('header').should('include.text', 'Id: 3');
    cy.get('[data-cy="goback"]').click();
    cy.get('[data-cy="resource-table"]').eq(0).find('tbody').children().should('have.length', 3);
  });

  it('edits a idp', () => {
    cy.intercept('GET', '**/api/admin/idps/1', apiResponse(idp1));
    cy.intercept('PATCH', '**/api/admin/idps/1', {
      ...apiResponse(idp1),
      data: { ...idp1, name: 'new_name' },
    });
    cy.get('[data-cy="mainmenu-resource-idps"]>span>a').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .find('tbody')
      .children()
      .eq(0)
      .find('a[data-cy="edit-resource"]')
      .click();
    cy.get('h1').should('have.text', 'Redigera IDP');
    cy.get('header').should('include.text', 'Id: 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-idps-name"]').should('have.value', 'testidp 1');
    cy.get('[data-cy="edit-idps-name"]').clear();
    cy.get('[data-cy="edit-idps-name"]').type('new_name');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
  });
});
