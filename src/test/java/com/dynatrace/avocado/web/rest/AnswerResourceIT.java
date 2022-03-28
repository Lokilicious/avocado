package com.dynatrace.avocado.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dynatrace.avocado.IntegrationTest;
import com.dynatrace.avocado.domain.Answer;
import com.dynatrace.avocado.repository.AnswerRepository;
import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AnswerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnswerResourceIT {

    private static final Long DEFAULT_NUM_RESPONSES = 1L;
    private static final Long UPDATED_NUM_RESPONSES = 2L;

    private static final Double DEFAULT_RESULT_NUMERIC = 1D;
    private static final Double UPDATED_RESULT_NUMERIC = 2D;

    private static final String DEFAULT_RESULT_STRING = "AAAAAAAAAA";
    private static final String UPDATED_RESULT_STRING = "BBBBBBBBBB";

    private static final Long DEFAULT_ORDER = 1L;
    private static final Long UPDATED_ORDER = 2L;

    private static final String ENTITY_API_URL = "/api/answers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnswerMockMvc;

    private Answer answer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Answer createEntity(EntityManager em) {
        Answer answer = new Answer()
            .numResponses(DEFAULT_NUM_RESPONSES)
            .resultNumeric(DEFAULT_RESULT_NUMERIC)
            .resultString(DEFAULT_RESULT_STRING)
            .order(DEFAULT_ORDER);
        return answer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Answer createUpdatedEntity(EntityManager em) {
        Answer answer = new Answer()
            .numResponses(UPDATED_NUM_RESPONSES)
            .resultNumeric(UPDATED_RESULT_NUMERIC)
            .resultString(UPDATED_RESULT_STRING)
            .order(UPDATED_ORDER);
        return answer;
    }

    @BeforeEach
    public void initTest() {
        answer = createEntity(em);
    }

    @Test
    @Transactional
    void createAnswer() throws Exception {
        int databaseSizeBeforeCreate = answerRepository.findAll().size();
        // Create the Answer
        restAnswerMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isCreated());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeCreate + 1);
        Answer testAnswer = answerList.get(answerList.size() - 1);
        assertThat(testAnswer.getNumResponses()).isEqualTo(DEFAULT_NUM_RESPONSES);
        assertThat(testAnswer.getResultNumeric()).isEqualTo(DEFAULT_RESULT_NUMERIC);
        assertThat(testAnswer.getResultString()).isEqualTo(DEFAULT_RESULT_STRING);
        assertThat(testAnswer.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    void createAnswerWithExistingId() throws Exception {
        // Create the Answer with an existing ID
        answerRepository.saveAndFlush(answer);

        int databaseSizeBeforeCreate = answerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnswerMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAnswers() throws Exception {
        // Initialize the database
        answerRepository.saveAndFlush(answer);

        // Get all the answerList
        restAnswerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(answer.getId().toString())))
            .andExpect(jsonPath("$.[*].numResponses").value(hasItem(DEFAULT_NUM_RESPONSES.intValue())))
            .andExpect(jsonPath("$.[*].resultNumeric").value(hasItem(DEFAULT_RESULT_NUMERIC.doubleValue())))
            .andExpect(jsonPath("$.[*].resultString").value(hasItem(DEFAULT_RESULT_STRING)))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER.intValue())));
    }

    @Test
    @Transactional
    void getAnswer() throws Exception {
        // Initialize the database
        answerRepository.saveAndFlush(answer);

        // Get the answer
        restAnswerMockMvc
            .perform(get(ENTITY_API_URL_ID, answer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(answer.getId().toString()))
            .andExpect(jsonPath("$.numResponses").value(DEFAULT_NUM_RESPONSES.intValue()))
            .andExpect(jsonPath("$.resultNumeric").value(DEFAULT_RESULT_NUMERIC.doubleValue()))
            .andExpect(jsonPath("$.resultString").value(DEFAULT_RESULT_STRING))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingAnswer() throws Exception {
        // Get the answer
        restAnswerMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAnswer() throws Exception {
        // Initialize the database
        answerRepository.saveAndFlush(answer);

        int databaseSizeBeforeUpdate = answerRepository.findAll().size();

        // Update the answer
        Answer updatedAnswer = answerRepository.findById(answer.getId()).get();
        // Disconnect from session so that the updates on updatedAnswer are not directly saved in db
        em.detach(updatedAnswer);
        updatedAnswer
            .numResponses(UPDATED_NUM_RESPONSES)
            .resultNumeric(UPDATED_RESULT_NUMERIC)
            .resultString(UPDATED_RESULT_STRING)
            .order(UPDATED_ORDER);

        restAnswerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnswer.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAnswer))
            )
            .andExpect(status().isOk());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
        Answer testAnswer = answerList.get(answerList.size() - 1);
        assertThat(testAnswer.getNumResponses()).isEqualTo(UPDATED_NUM_RESPONSES);
        assertThat(testAnswer.getResultNumeric()).isEqualTo(UPDATED_RESULT_NUMERIC);
        assertThat(testAnswer.getResultString()).isEqualTo(UPDATED_RESULT_STRING);
        assertThat(testAnswer.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void putNonExistingAnswer() throws Exception {
        int databaseSizeBeforeUpdate = answerRepository.findAll().size();
        answer.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnswerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, answer.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnswer() throws Exception {
        int databaseSizeBeforeUpdate = answerRepository.findAll().size();
        answer.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnswer() throws Exception {
        int databaseSizeBeforeUpdate = answerRepository.findAll().size();
        answer.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnswerWithPatch() throws Exception {
        // Initialize the database
        answerRepository.saveAndFlush(answer);

        int databaseSizeBeforeUpdate = answerRepository.findAll().size();

        // Update the answer using partial update
        Answer partialUpdatedAnswer = new Answer();
        partialUpdatedAnswer.setId(answer.getId());

        partialUpdatedAnswer.numResponses(UPDATED_NUM_RESPONSES).resultNumeric(UPDATED_RESULT_NUMERIC);

        restAnswerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnswer.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnswer))
            )
            .andExpect(status().isOk());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
        Answer testAnswer = answerList.get(answerList.size() - 1);
        assertThat(testAnswer.getNumResponses()).isEqualTo(UPDATED_NUM_RESPONSES);
        assertThat(testAnswer.getResultNumeric()).isEqualTo(UPDATED_RESULT_NUMERIC);
        assertThat(testAnswer.getResultString()).isEqualTo(DEFAULT_RESULT_STRING);
        assertThat(testAnswer.getOrder()).isEqualTo(DEFAULT_ORDER);
    }

    @Test
    @Transactional
    void fullUpdateAnswerWithPatch() throws Exception {
        // Initialize the database
        answerRepository.saveAndFlush(answer);

        int databaseSizeBeforeUpdate = answerRepository.findAll().size();

        // Update the answer using partial update
        Answer partialUpdatedAnswer = new Answer();
        partialUpdatedAnswer.setId(answer.getId());

        partialUpdatedAnswer
            .numResponses(UPDATED_NUM_RESPONSES)
            .resultNumeric(UPDATED_RESULT_NUMERIC)
            .resultString(UPDATED_RESULT_STRING)
            .order(UPDATED_ORDER);

        restAnswerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnswer.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnswer))
            )
            .andExpect(status().isOk());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
        Answer testAnswer = answerList.get(answerList.size() - 1);
        assertThat(testAnswer.getNumResponses()).isEqualTo(UPDATED_NUM_RESPONSES);
        assertThat(testAnswer.getResultNumeric()).isEqualTo(UPDATED_RESULT_NUMERIC);
        assertThat(testAnswer.getResultString()).isEqualTo(UPDATED_RESULT_STRING);
        assertThat(testAnswer.getOrder()).isEqualTo(UPDATED_ORDER);
    }

    @Test
    @Transactional
    void patchNonExistingAnswer() throws Exception {
        int databaseSizeBeforeUpdate = answerRepository.findAll().size();
        answer.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnswerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, answer.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnswer() throws Exception {
        int databaseSizeBeforeUpdate = answerRepository.findAll().size();
        answer.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnswer() throws Exception {
        int databaseSizeBeforeUpdate = answerRepository.findAll().size();
        answer.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnswerMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(answer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Answer in the database
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnswer() throws Exception {
        // Initialize the database
        answerRepository.saveAndFlush(answer);

        int databaseSizeBeforeDelete = answerRepository.findAll().size();

        // Delete the answer
        restAnswerMockMvc
            .perform(delete(ENTITY_API_URL_ID, answer.getId().toString()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Answer> answerList = answerRepository.findAll();
        assertThat(answerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
