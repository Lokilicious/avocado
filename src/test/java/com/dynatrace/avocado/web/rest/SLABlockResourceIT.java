package com.dynatrace.avocado.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dynatrace.avocado.IntegrationTest;
import com.dynatrace.avocado.domain.SLABlock;
import com.dynatrace.avocado.repository.SLABlockRepository;
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
 * Integration tests for the {@link SLABlockResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SLABlockResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sla-blocks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private SLABlockRepository sLABlockRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSLABlockMockMvc;

    private SLABlock sLABlock;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SLABlock createEntity(EntityManager em) {
        SLABlock sLABlock = new SLABlock().name(DEFAULT_NAME);
        return sLABlock;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SLABlock createUpdatedEntity(EntityManager em) {
        SLABlock sLABlock = new SLABlock().name(UPDATED_NAME);
        return sLABlock;
    }

    @BeforeEach
    public void initTest() {
        sLABlock = createEntity(em);
    }

    @Test
    @Transactional
    void createSLABlock() throws Exception {
        int databaseSizeBeforeCreate = sLABlockRepository.findAll().size();
        // Create the SLABlock
        restSLABlockMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isCreated());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeCreate + 1);
        SLABlock testSLABlock = sLABlockList.get(sLABlockList.size() - 1);
        assertThat(testSLABlock.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createSLABlockWithExistingId() throws Exception {
        // Create the SLABlock with an existing ID
        sLABlockRepository.saveAndFlush(sLABlock);

        int databaseSizeBeforeCreate = sLABlockRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSLABlockMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSLABlocks() throws Exception {
        // Initialize the database
        sLABlockRepository.saveAndFlush(sLABlock);

        // Get all the sLABlockList
        restSLABlockMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sLABlock.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getSLABlock() throws Exception {
        // Initialize the database
        sLABlockRepository.saveAndFlush(sLABlock);

        // Get the sLABlock
        restSLABlockMockMvc
            .perform(get(ENTITY_API_URL_ID, sLABlock.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sLABlock.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingSLABlock() throws Exception {
        // Get the sLABlock
        restSLABlockMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSLABlock() throws Exception {
        // Initialize the database
        sLABlockRepository.saveAndFlush(sLABlock);

        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();

        // Update the sLABlock
        SLABlock updatedSLABlock = sLABlockRepository.findById(sLABlock.getId()).get();
        // Disconnect from session so that the updates on updatedSLABlock are not directly saved in db
        em.detach(updatedSLABlock);
        updatedSLABlock.name(UPDATED_NAME);

        restSLABlockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSLABlock.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSLABlock))
            )
            .andExpect(status().isOk());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
        SLABlock testSLABlock = sLABlockList.get(sLABlockList.size() - 1);
        assertThat(testSLABlock.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingSLABlock() throws Exception {
        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();
        sLABlock.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSLABlockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sLABlock.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSLABlock() throws Exception {
        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();
        sLABlock.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSLABlockMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSLABlock() throws Exception {
        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();
        sLABlock.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSLABlockMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSLABlockWithPatch() throws Exception {
        // Initialize the database
        sLABlockRepository.saveAndFlush(sLABlock);

        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();

        // Update the sLABlock using partial update
        SLABlock partialUpdatedSLABlock = new SLABlock();
        partialUpdatedSLABlock.setId(sLABlock.getId());

        restSLABlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSLABlock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSLABlock))
            )
            .andExpect(status().isOk());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
        SLABlock testSLABlock = sLABlockList.get(sLABlockList.size() - 1);
        assertThat(testSLABlock.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateSLABlockWithPatch() throws Exception {
        // Initialize the database
        sLABlockRepository.saveAndFlush(sLABlock);

        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();

        // Update the sLABlock using partial update
        SLABlock partialUpdatedSLABlock = new SLABlock();
        partialUpdatedSLABlock.setId(sLABlock.getId());

        partialUpdatedSLABlock.name(UPDATED_NAME);

        restSLABlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSLABlock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSLABlock))
            )
            .andExpect(status().isOk());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
        SLABlock testSLABlock = sLABlockList.get(sLABlockList.size() - 1);
        assertThat(testSLABlock.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingSLABlock() throws Exception {
        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();
        sLABlock.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSLABlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sLABlock.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSLABlock() throws Exception {
        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();
        sLABlock.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSLABlockMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isBadRequest());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSLABlock() throws Exception {
        int databaseSizeBeforeUpdate = sLABlockRepository.findAll().size();
        sLABlock.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSLABlockMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sLABlock))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SLABlock in the database
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSLABlock() throws Exception {
        // Initialize the database
        sLABlockRepository.saveAndFlush(sLABlock);

        int databaseSizeBeforeDelete = sLABlockRepository.findAll().size();

        // Delete the sLABlock
        restSLABlockMockMvc
            .perform(delete(ENTITY_API_URL_ID, sLABlock.getId().toString()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SLABlock> sLABlockList = sLABlockRepository.findAll();
        assertThat(sLABlockList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
