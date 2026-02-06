import { municipality1 } from 'cypress/fixtures/municipalities';
import { newOrganization, organization, organizationsWithNew } from 'cypress/fixtures/organizations';

describe('Organizations', () => {
  it('lists organizations on front page', () => {
    cy.get('[data-cy="resource-card-organizations"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'Organisationer');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '3 organisationer');
    });
  });
  it('lists and sorts organizations', () => {
    cy.get('[data-cy="resource-card-organizations"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('www.test.com');
        cy.get('tbody').children().eq(1).contains('www.test.se');
        cy.get('tbody').children().eq(2).contains('www.test.nu');

        cy.get('thead>tr').children().eq(1).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('www.test.com');
        cy.get('tbody').children().eq(1).contains('www.test.nu');
        cy.get('tbody').children().eq(2).contains('www.test.se');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 9);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Värd (domän)');
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'OrganisationsId');
  });

  it('creates a new organization', () => {
    cy.intercept('GET', '**/api/admin/organizations', organizationsWithNew);
    cy.intercept('GET', '**/api/admin/organizations/4', newOrganization);
    cy.intercept('POST', '**/api/admin/organizations', newOrganization).as('save');
    cy.get('[data-cy="mainmenu-resource-organizations"]>span>button').click();
    cy.contains('Skapa ny organisation').click();
    cy.get('h1').should('have.text', 'Skapa ny organisation');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('input[data-cy="edit-organizations-name"]').type('Bolag 4');
    cy.get('input[data-cy="edit-organizations-orgId"]').clear().type('23');
    cy.get('input[data-cy="edit-organizations-host"]').clear().type('mytest.this');
    cy.get('[data-cy="edit-organizations-pick-logo"]').click();
    cy.get('[data-cy="logotype-modal"]').within(() => {
      cy.get('[data-cy="logotype-grid"]').children().should('have.length', 3);
      cy.get('[data-cy="logotype-grid"]').children().eq(0).click();
      cy.get('[data-cy="button-submit"]').click();
    });
    cy.get('[data-cy="edit-organizations-pick-logo"]').should('not.exist');
    cy.get('[data-cy="select-municipality"]').children().should('have.length', 2);
    cy.get('[data-cy="select-municipality"]').select('(200) Kommun 2');

    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.wait('@save');
    cy.get('h1').should('have.text', 'Redigera organisation');
    cy.get('header').should('include.text', 'Id: 4');
    cy.get('[data-cy="goback"]').click();
    cy.get('[data-cy="resource-table"]').eq(0).find('tbody').children().should('have.length', 4);
  });

  it('edits a organization', () => {
    cy.intercept('GET', '**/api/admin/organizations/1', organization);
    cy.intercept('PATCH', '**/api/admin/organizations/1', {
      ...organization,
      data: {
        ...organization?.data,
        name: 'Nytt namn',
        municipalityId: municipality1.municipalityId,
        municipality: municipality1,
      },
    });
    cy.get('[data-cy="mainmenu-resource-organizations"]>span>a').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .find('tbody')
      .children()
      .eq(0)
      .find('a[data-cy="edit-resource"]')
      .click();
    cy.get('h1').should('have.text', 'Redigera organisation');
    cy.get('header').should('include.text', 'Id: 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-organizations-name"]').should('have.value', 'Bolag 1');
    cy.get('[data-cy="edit-organizations-name"]').clear();
    cy.get('[data-cy="edit-organizations-name"]').type('Nytt namn');
    cy.get('[data-cy="select-municipality"]').select('(100) Kommun 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
  });
});
