package com.dynatrace.avocado.web.rest;

import com.dynatrace.avocado.domain.Survey;
import com.dynatrace.avocado.repository.SurveyRepository;
import com.dynatrace.avocado.utils.ExcelTable;
import com.dynatrace.avocado.utils.ExcelUtils;
import com.dynatrace.avocado.utils.SurveyUtils;
import com.dynatrace.avocado.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

/**
 * REST controller for managing {@link com.dynatrace.avocado.domain.Survey}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SurveyResource {

    private final Logger log = LoggerFactory.getLogger(SurveyResource.class);

    private static final String ENTITY_NAME = "survey";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SurveyRepository surveyRepository;

    public SurveyResource(SurveyRepository surveyRepository) {
        this.surveyRepository = surveyRepository;
    }

    /**
     * {@code POST  /surveys} : Create a new survey.
     *
     * @param survey the survey to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new survey, or with status {@code 400 (Bad Request)} if the survey has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/surveys")
    public ResponseEntity<Survey> createSurvey(@RequestBody Survey survey) throws URISyntaxException {
        log.debug("REST request to save Survey : {}", survey);
        if (survey.getId() != null) {
            throw new BadRequestAlertException("A new survey cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Survey result = surveyRepository.save(survey);
        return ResponseEntity
            .created(new URI("/api/surveys/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/teams/{teamId}/survey/import")
    public ResponseEntity<Survey> importExcel(
        @PathVariable(value = "teamId", required = true) final UUID teamId,
        @RequestParam("file") final MultipartFile file) throws IOException, URISyntaxException {

        ExcelTable table = ExcelUtils.parseExcel(file.getInputStream());
        Survey survey = SurveyUtils.createSurvey(table);

        Survey result = surveyRepository.save(survey);
        return ResponseEntity
            .created(new URI("/api/surveys/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /surveys/:id} : Updates an existing survey.
     *
     * @param id the id of the survey to save.
     * @param survey the survey to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated survey,
     * or with status {@code 400 (Bad Request)} if the survey is not valid,
     * or with status {@code 500 (Internal Server Error)} if the survey couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/surveys/{id}")
    public ResponseEntity<Survey> updateSurvey(@PathVariable(value = "id", required = false) final UUID id, @RequestBody Survey survey)
        throws URISyntaxException {
        log.debug("REST request to update Survey : {}, {}", id, survey);
        if (survey.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, survey.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!surveyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Survey result = surveyRepository.save(survey);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, survey.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /surveys/:id} : Partial updates given fields of an existing survey, field will ignore if it is null
     *
     * @param id the id of the survey to save.
     * @param survey the survey to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated survey,
     * or with status {@code 400 (Bad Request)} if the survey is not valid,
     * or with status {@code 404 (Not Found)} if the survey is not found,
     * or with status {@code 500 (Internal Server Error)} if the survey couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/surveys/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Survey> partialUpdateSurvey(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody Survey survey
    ) throws URISyntaxException {
        log.debug("REST request to partial update Survey partially : {}, {}", id, survey);
        if (survey.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, survey.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!surveyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Survey> result = surveyRepository
            .findById(survey.getId())
            .map(existingSurvey -> {
                if (survey.getSurveyDate() != null) {
                    existingSurvey.setSurveyDate(survey.getSurveyDate());
                }
                if (survey.getCreatedDate() != null) {
                    existingSurvey.setCreatedDate(survey.getCreatedDate());
                }

                return existingSurvey;
            })
            .map(surveyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, survey.getId().toString())
        );
    }

    /**
     * {@code GET  /surveys} : get all the surveys.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of surveys in body.
     */
    @GetMapping("/surveys")
    public List<Survey> getAllSurveys() {
        log.debug("REST request to get all Surveys");
        return surveyRepository.findAll();
    }

    /**
     * {@code GET  /surveys/:id} : get the "id" survey.
     *
     * @param id the id of the survey to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the survey, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/surveys/{id}")
    public ResponseEntity<Survey> getSurvey(@PathVariable UUID id) {
        log.debug("REST request to get Survey : {}", id);
        Optional<Survey> survey = surveyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(survey);
    }

    /**
     * {@code DELETE  /surveys/:id} : delete the "id" survey.
     *
     * @param id the id of the survey to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/surveys/{id}")
    public ResponseEntity<Void> deleteSurvey(@PathVariable UUID id) {
        log.debug("REST request to delete Survey : {}", id);
        surveyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
