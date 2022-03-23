package com.dynatrace.avocado.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dynatrace.avocado.IntegrationTest;
import com.dynatrace.avocado.domain.Capability;
import com.dynatrace.avocado.repository.CapabilityRepository;
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
 * Integration tests for the {@link CapabilityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CapabilityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/capabilities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private CapabilityRepository capabilityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCapabilityMockMvc;

    private Capability capability;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Capability createEntity(EntityManager em) {
        Capability capability = new Capability().name(DEFAULT_NAME);
        return capability;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Capability createUpdatedEntity(EntityManager em) {
        Capability capability = new Capability().name(UPDATED_NAME);
        return capability;
    }

    @BeforeEach
    public void initTest() {
        capability = createEntity(em);
    }

    @Test
    @Transactional
    void createCapability() throws Exception {
        int databaseSizeBeforeCreate = capabilityRepository.findAll().size();
        // Create the Capability
        restCapabilityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isCreated());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeCreate + 1);
        Capability testCapability = capabilityList.get(capabilityList.size() - 1);
        assertThat(testCapability.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createCapabilityWithExistingId() throws Exception {
        // Create the Capability with an existing ID
        capabilityRepository.saveAndFlush(capability);

        int databaseSizeBeforeCreate = capabilityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCapabilityMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isBadRequest());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCapabilities() throws Exception {
        // Initialize the database
        capabilityRepository.saveAndFlush(capability);

        // Get all the capabilityList
        restCapabilityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(capability.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getCapability() throws Exception {
        // Initialize the database
        capabilityRepository.saveAndFlush(capability);

        // Get the capability
        restCapabilityMockMvc
            .perform(get(ENTITY_API_URL_ID, capability.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(capability.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingCapability() throws Exception {
        // Get the capability
        restCapabilityMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCapability() throws Exception {
        // Initialize the database
        capabilityRepository.saveAndFlush(capability);

        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();

        // Update the capability
        Capability updatedCapability = capabilityRepository.findById(capability.getId()).get();
        // Disconnect from session so that the updates on updatedCapability are not directly saved in db
        em.detach(updatedCapability);
        updatedCapability.name(UPDATED_NAME);

        restCapabilityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCapability.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCapability))
            )
            .andExpect(status().isOk());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
        Capability testCapability = capabilityList.get(capabilityList.size() - 1);
        assertThat(testCapability.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingCapability() throws Exception {
        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();
        capability.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCapabilityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, capability.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isBadRequest());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCapability() throws Exception {
        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();
        capability.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCapabilityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isBadRequest());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCapability() throws Exception {
        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();
        capability.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCapabilityMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCapabilityWithPatch() throws Exception {
        // Initialize the database
        capabilityRepository.saveAndFlush(capability);

        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();

        // Update the capability using partial update
        Capability partialUpdatedCapability = new Capability();
        partialUpdatedCapability.setId(capability.getId());

        partialUpdatedCapability.name(UPDATED_NAME);

        restCapabilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCapability.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCapability))
            )
            .andExpect(status().isOk());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
        Capability testCapability = capabilityList.get(capabilityList.size() - 1);
        assertThat(testCapability.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateCapabilityWithPatch() throws Exception {
        // Initialize the database
        capabilityRepository.saveAndFlush(capability);

        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();

        // Update the capability using partial update
        Capability partialUpdatedCapability = new Capability();
        partialUpdatedCapability.setId(capability.getId());

        partialUpdatedCapability.name(UPDATED_NAME);

        restCapabilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCapability.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCapability))
            )
            .andExpect(status().isOk());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
        Capability testCapability = capabilityList.get(capabilityList.size() - 1);
        assertThat(testCapability.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingCapability() throws Exception {
        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();
        capability.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCapabilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, capability.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isBadRequest());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCapability() throws Exception {
        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();
        capability.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCapabilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isBadRequest());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCapability() throws Exception {
        int databaseSizeBeforeUpdate = capabilityRepository.findAll().size();
        capability.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCapabilityMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(capability))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Capability in the database
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCapability() throws Exception {
        // Initialize the database
        capabilityRepository.saveAndFlush(capability);

        int databaseSizeBeforeDelete = capabilityRepository.findAll().size();

        // Delete the capability
        restCapabilityMockMvc
            .perform(delete(ENTITY_API_URL_ID, capability.getId().toString()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Capability> capabilityList = capabilityRepository.findAll();
        assertThat(capabilityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
