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

describe('Survey e2e test', () => {
  const surveyPageUrl = '/survey';
  const surveyPageUrlPattern = new RegExp('/survey(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const surveySample = {};

  let survey: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/surveys+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/surveys').as('postEntityRequest');
    cy.intercept('DELETE', '/api/surveys/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (survey) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/surveys/${survey.id}`,
      }).then(() => {
        survey = undefined;
      });
    }
  });

  it('Surveys menu should load Surveys page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('survey');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Survey').should('exist');
    cy.url().should('match', surveyPageUrlPattern);
  });

  describe('Survey page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(surveyPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Survey page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/survey/new$'));
        cy.getEntityCreateUpdateHeading('Survey');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', surveyPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/surveys',
          body: surveySample,
        }).then(({ body }) => {
          survey = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/surveys+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [survey],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(surveyPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Survey page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('survey');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', surveyPageUrlPattern);
      });

      it('edit button click should load edit Survey page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Survey');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', surveyPageUrlPattern);
      });

      it('last delete button click should delete instance of Survey', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('survey').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', surveyPageUrlPattern);

        survey = undefined;
      });
    });
  });

  describe('new Survey page', () => {
    beforeEach(() => {
      cy.visit(`${surveyPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Survey');
    });

    it('should create an instance of Survey', () => {
      cy.get(`[data-cy="surveyDate"]`).type('2022-03-23T06:17').should('have.value', '2022-03-23T06:17');

      cy.get(`[data-cy="createdDate"]`).type('2022-03-23T09:00').should('have.value', '2022-03-23T09:00');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        survey = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', surveyPageUrlPattern);
    });
  });
});
