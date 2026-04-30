import { apiResponse } from 'cypress/fixtures/apiresponse';
import { host1, host2, host3, newHost } from 'cypress/fixtures/hosts';

describe('Hosts', () => {
  it('lists hosts on front page', () => {
    cy.get('[data-cy="resource-card-hosts"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'Värdar');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '3 värdar');
    });
  });
  it('lists and sorts hosts', () => {
    cy.get('[data-cy="resource-card-hosts"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('host1');
        cy.get('tbody').children().eq(1).contains('host2');
        cy.get('tbody').children().eq(2).contains('host3');

        cy.get('thead>tr').children().eq(0).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('host3');
        cy.get('tbody').children().eq(1).contains('host2');
        cy.get('tbody').children().eq(2).contains('host1');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 7);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Namn');
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Kommunkod');
  });

  it('creates a new host', () => {
    cy.intercept('GET', '**/api/admin/hosts', apiResponse([host1, host2, host3, newHost]));
    cy.intercept('GET', '**/api/admin/hosts/4', apiResponse(newHost));
    cy.intercept('POST', '**/api/admin/hosts', apiResponse(newHost)).as('save');
    cy.get('[data-cy="mainmenu-resource-hosts"]>span>button').click();
    cy.contains('Skapa ny värd').click();
    cy.get('h1').should('have.text', 'Skapa ny värd');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-hosts-name"]').type('newhost');
    cy.get('[data-cy="edit-hosts-municipalityId"]').clear().type('110');
    cy.get('[data-cy="edit-hosts-idp"]').select('testidp 2');

    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.wait('@save');
    cy.get('h1').should('have.text', 'Redigera värd');
    cy.get('header').should('include.text', 'Id: 4');
    cy.get('[data-cy="goback"]').click();
    cy.get('[data-cy="resource-table"]').eq(0).find('tbody').children().should('have.length', 4);
  });

  it('edits a host', () => {
    cy.intercept('GET', '**/api/admin/hosts/1', apiResponse(host1));
    cy.intercept('PATCH', '**/api/admin/hosts/1', {
      ...apiResponse(host1),
      data: { ...host1, name: 'new_name' },
    });
    cy.get('[data-cy="mainmenu-resource-hosts"]>span>a').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .find('tbody')
      .children()
      .eq(0)
      .find('a[data-cy="edit-resource"]')
      .click();
    cy.get('h1').should('have.text', 'Redigera värd');
    cy.get('header').should('include.text', 'Id: 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-hosts-name"]').should('have.value', 'host1');
    cy.get('[data-cy="edit-hosts-name"]').clear();
    cy.get('[data-cy="edit-hosts-name"]').type('new_name');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
  });
});
