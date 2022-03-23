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

describe('SLABlock e2e test', () => {
  const sLABlockPageUrl = '/sla-block';
  const sLABlockPageUrlPattern = new RegExp('/sla-block(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const sLABlockSample = {};

  let sLABlock: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/sla-blocks+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/sla-blocks').as('postEntityRequest');
    cy.intercept('DELETE', '/api/sla-blocks/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (sLABlock) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/sla-blocks/${sLABlock.id}`,
      }).then(() => {
        sLABlock = undefined;
      });
    }
  });

  it('SLABlocks menu should load SLABlocks page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('sla-block');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('SLABlock').should('exist');
    cy.url().should('match', sLABlockPageUrlPattern);
  });

  describe('SLABlock page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(sLABlockPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create SLABlock page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/sla-block/new$'));
        cy.getEntityCreateUpdateHeading('SLABlock');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', sLABlockPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/sla-blocks',
          body: sLABlockSample,
        }).then(({ body }) => {
          sLABlock = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/sla-blocks+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [sLABlock],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(sLABlockPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details SLABlock page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('sLABlock');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', sLABlockPageUrlPattern);
      });

      it('edit button click should load edit SLABlock page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SLABlock');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', sLABlockPageUrlPattern);
      });

      it('last delete button click should delete instance of SLABlock', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('sLABlock').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', sLABlockPageUrlPattern);

        sLABlock = undefined;
      });
    });
  });

  describe('new SLABlock page', () => {
    beforeEach(() => {
      cy.visit(`${sLABlockPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('SLABlock');
    });

    it('should create an instance of SLABlock', () => {
      cy.get(`[data-cy="name"]`).type('Home overriding').should('have.value', 'Home overriding');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        sLABlock = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', sLABlockPageUrlPattern);
    });
  });
});
