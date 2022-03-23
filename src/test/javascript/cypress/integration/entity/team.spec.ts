import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Team e2e test', () => {
  const teamPageUrl = '/team';
  const teamPageUrlPattern = new RegExp('/team(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const teamSample = {};

  let team: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/teams+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/teams').as('postEntityRequest');
    cy.intercept('DELETE', '/api/teams/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (team) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/teams/${team.id}`,
      }).then(() => {
        team = undefined;
      });
    }
  });

  it('Teams menu should load Teams page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('team');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Team').should('exist');
    cy.url().should('match', teamPageUrlPattern);
  });

  describe('Team page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(teamPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Team page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/team/new$'));
        cy.getEntityCreateUpdateHeading('Team');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/teams',
          body: teamSample,
        }).then(({ body }) => {
          team = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/teams+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [team],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(teamPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Team page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('team');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPageUrlPattern);
      });

      it('edit button click should load edit Team page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Team');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPageUrlPattern);
      });

      it('last delete button click should delete instance of Team', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('team').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', teamPageUrlPattern);

        team = undefined;
      });
    });
  });

  describe('new Team page', () => {
    beforeEach(() => {
      cy.visit(`${teamPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Team');
    });

    it('should create an instance of Team', () => {
      cy.get(`[data-cy="name"]`).type('Cotton').should('have.value', 'Cotton');

      cy.get(`[data-cy="advocate"]`).type('orchestration base').should('have.value', 'orchestration base');

      cy.get(`[data-cy="coach"]`).type('Future Mill Cape').should('have.value', 'Future Mill Cape');

      cy.get(`[data-cy="currentlyCoached"]`).should('not.be.checked');
      cy.get(`[data-cy="currentlyCoached"]`).click().should('be.checked');

      cy.get(`[data-cy="numMembers"]`).type('56416').should('have.value', '56416');

      cy.get(`[data-cy="createdDate"]`).type('2022-03-23T00:53').should('have.value', '2022-03-23T00:53');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        team = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', teamPageUrlPattern);
    });
  });
});
