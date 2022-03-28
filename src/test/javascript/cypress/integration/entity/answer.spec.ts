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

describe('Answer e2e test', () => {
  const answerPageUrl = '/answer';
  const answerPageUrlPattern = new RegExp('/answer(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const answerSample = {};

  let answer: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/answers+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/answers').as('postEntityRequest');
    cy.intercept('DELETE', '/api/answers/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (answer) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/answers/${answer.id}`,
      }).then(() => {
        answer = undefined;
      });
    }
  });

  it('Answers menu should load Answers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('answer');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Answer').should('exist');
    cy.url().should('match', answerPageUrlPattern);
  });

  describe('Answer page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(answerPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Answer page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/answer/new$'));
        cy.getEntityCreateUpdateHeading('Answer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', answerPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/answers',
          body: answerSample,
        }).then(({ body }) => {
          answer = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/answers+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [answer],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(answerPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Answer page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('answer');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', answerPageUrlPattern);
      });

      it('edit button click should load edit Answer page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Answer');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', answerPageUrlPattern);
      });

      it('last delete button click should delete instance of Answer', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('answer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', answerPageUrlPattern);

        answer = undefined;
      });
    });
  });

  describe('new Answer page', () => {
    beforeEach(() => {
      cy.visit(`${answerPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Answer');
    });

    it('should create an instance of Answer', () => {
      cy.get(`[data-cy="numResponses"]`).type('18604').should('have.value', '18604');

      cy.get(`[data-cy="resultNumeric"]`).type('52413').should('have.value', '52413');

      cy.get(`[data-cy="resultString"]`)
        .type('Pizza out-of-the-box synthesizing')
        .should('have.value', 'Pizza out-of-the-box synthesizing');

      cy.get(`[data-cy="order"]`).type('25895').should('have.value', '25895');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        answer = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', answerPageUrlPattern);
    });
  });
});
