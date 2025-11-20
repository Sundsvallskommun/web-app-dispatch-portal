import { municipalitiesWithNew, municipalitiy, newMunicipalitiy } from 'cypress/fixtures/municipalities';

describe('Municipalities', () => {
  it('lists municipalities on front page', () => {
    cy.get('[data-cy="resource-card-municipalities"]').within(() => {
      cy.get('[data-cy="resource-card-title"]').should('have.text', 'Kommuner');
      cy.get('[data-cy="resource-card-subtitle"]').should('have.text', '2 kommuner');
    });
  });
  it('lists and sorts municipalities', () => {
    cy.get('[data-cy="resource-card-municipalities"]').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .within(() => {
        cy.get('tbody').children().eq(0).contains('Kommun 1');
        cy.get('tbody').children().eq(1).contains('Kommun 2');

        cy.get('thead>tr').children().eq(0).find('button.sk-table-sortbutton').click();

        cy.get('tbody').children().eq(0).contains('Kommun 2');
        cy.get('tbody').children().eq(1).contains('Kommun 1');
      });

    cy.get('[data-cy="table-settings-button"]').click();
    cy.get('[data-cy="table-settings-panel"]').children().should('have.length', 7);
    cy.get('[data-cy="table-settings-panel"]').children().eq(0).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Kommunkod');
    cy.get('[data-cy="table-settings-panel"]').children().eq(1).click();
    cy.get('[data-cy="resource-table"]>thead>tr').children().eq(0).should('include.text', 'Namn');
  });

  it('creates a new municipality', () => {
    cy.intercept('GET', '**/api/admin/municipalities', municipalitiesWithNew);
    cy.intercept('GET', '**/api/admin/municipalities/3', newMunicipalitiy);
    cy.intercept('POST', '**/api/admin/municipalities', newMunicipalitiy).as('save');
    cy.get('[data-cy="mainmenu-resource-municipalities"]>span>button').click();
    cy.contains('Skapa ny kommun').click();
    cy.get('h1').should('have.text', 'Skapa ny kommun');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('input[data-cy="edit-municipalities-name"]').type('Kommun 3');
    cy.get('input[data-cy="edit-municipalities-municipalityId"]').clear().type('300');
    cy.get('[data-cy="edit-municipalities-pick-logo"]').click();
    cy.get('[data-cy="logotype-modal"]').within(() => {
      cy.get('[data-cy="logotype-grid"]').children().should('have.length', 3);
      cy.get('[data-cy="logotype-grid"]').children().eq(2).click();
      cy.get('[data-cy="button-submit"]').click();
    });
    cy.get('[data-cy="edit-municipalities-pick-logo"]').should('not.exist');

    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-delete"]').click();
    cy.get('article.sk-modal-dialog').within(() => {
      cy.get('h1').should('have.text', 'Du har osparade ändringar');
      cy.get('button').contains('Nej').click();
    });
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.wait('@save');
    cy.get('h1').should('have.text', 'Redigera kommun');
    cy.get('header').should('include.text', 'Id: 3');
    cy.get('[data-cy="goback"]').click();
    cy.get('[data-cy="resource-table"]').eq(0).find('tbody').children().should('have.length', 3);
  });

  it('edits a municipality', () => {
    cy.intercept('GET', '**/api/admin/municipalities/1', municipalitiy);
    cy.intercept('PATCH', '**/api/admin/municipalities/1', {
      ...municipalitiy,
      data: { ...municipalitiy?.data, name: 'Nytt namn' },
    });
    cy.get('[data-cy="mainmenu-resource-municipalities"]>span>a').click();
    cy.get('[data-cy="resource-table"]')
      .eq(0)
      .find('tbody')
      .children()
      .eq(0)
      .find('a[data-cy="edit-resource"]')
      .click();
    cy.get('h1').should('have.text', 'Redigera kommun');
    cy.get('header').should('include.text', 'Id: 1');
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
    cy.get('[data-cy="edit-municipalities-name"]').should('have.value', 'Kommun 1');
    cy.get('[data-cy="edit-municipalities-name"]').clear();
    cy.get('[data-cy="edit-municipalities-name"]').type('Nytt namn');
    cy.get('[data-cy="edit-toolbar-save"]').should('not.be.disabled');
    cy.get('[data-cy="edit-toolbar-save"]').click();
    cy.get('[data-cy="edit-toolbar-save"]').should('be.disabled');
  });
});
