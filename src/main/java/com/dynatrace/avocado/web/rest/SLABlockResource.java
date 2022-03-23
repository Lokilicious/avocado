package com.dynatrace.avocado.web.rest;

import com.dynatrace.avocado.domain.SLABlock;
import com.dynatrace.avocado.repository.SLABlockRepository;
import com.dynatrace.avocado.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.dynatrace.avocado.domain.SLABlock}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SLABlockResource {

    private final Logger log = LoggerFactory.getLogger(SLABlockResource.class);

    private static final String ENTITY_NAME = "sLABlock";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SLABlockRepository sLABlockRepository;

    public SLABlockResource(SLABlockRepository sLABlockRepository) {
        this.sLABlockRepository = sLABlockRepository;
    }

    /**
     * {@code POST  /sla-blocks} : Create a new sLABlock.
     *
     * @param sLABlock the sLABlock to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sLABlock, or with status {@code 400 (Bad Request)} if the sLABlock has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sla-blocks")
    public ResponseEntity<SLABlock> createSLABlock(@RequestBody SLABlock sLABlock) throws URISyntaxException {
        log.debug("REST request to save SLABlock : {}", sLABlock);
        if (sLABlock.getId() != null) {
            throw new BadRequestAlertException("A new sLABlock cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SLABlock result = sLABlockRepository.save(sLABlock);
        return ResponseEntity
            .created(new URI("/api/sla-blocks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sla-blocks/:id} : Updates an existing sLABlock.
     *
     * @param id the id of the sLABlock to save.
     * @param sLABlock the sLABlock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sLABlock,
     * or with status {@code 400 (Bad Request)} if the sLABlock is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sLABlock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sla-blocks/{id}")
    public ResponseEntity<SLABlock> updateSLABlock(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody SLABlock sLABlock
    ) throws URISyntaxException {
        log.debug("REST request to update SLABlock : {}, {}", id, sLABlock);
        if (sLABlock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sLABlock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sLABlockRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SLABlock result = sLABlockRepository.save(sLABlock);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sLABlock.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sla-blocks/:id} : Partial updates given fields of an existing sLABlock, field will ignore if it is null
     *
     * @param id the id of the sLABlock to save.
     * @param sLABlock the sLABlock to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sLABlock,
     * or with status {@code 400 (Bad Request)} if the sLABlock is not valid,
     * or with status {@code 404 (Not Found)} if the sLABlock is not found,
     * or with status {@code 500 (Internal Server Error)} if the sLABlock couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sla-blocks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SLABlock> partialUpdateSLABlock(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody SLABlock sLABlock
    ) throws URISyntaxException {
        log.debug("REST request to partial update SLABlock partially : {}, {}", id, sLABlock);
        if (sLABlock.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sLABlock.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sLABlockRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SLABlock> result = sLABlockRepository
            .findById(sLABlock.getId())
            .map(existingSLABlock -> {
                if (sLABlock.getName() != null) {
                    existingSLABlock.setName(sLABlock.getName());
                }

                return existingSLABlock;
            })
            .map(sLABlockRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sLABlock.getId().toString())
        );
    }

    /**
     * {@code GET  /sla-blocks} : get all the sLABlocks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sLABlocks in body.
     */
    @GetMapping("/sla-blocks")
    public List<SLABlock> getAllSLABlocks() {
        log.debug("REST request to get all SLABlocks");
        return sLABlockRepository.findAll();
    }

    /**
     * {@code GET  /sla-blocks/:id} : get the "id" sLABlock.
     *
     * @param id the id of the sLABlock to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sLABlock, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sla-blocks/{id}")
    public ResponseEntity<SLABlock> getSLABlock(@PathVariable UUID id) {
        log.debug("REST request to get SLABlock : {}", id);
        Optional<SLABlock> sLABlock = sLABlockRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sLABlock);
    }

    /**
     * {@code DELETE  /sla-blocks/:id} : delete the "id" sLABlock.
     *
     * @param id the id of the sLABlock to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sla-blocks/{id}")
    public ResponseEntity<Void> deleteSLABlock(@PathVariable UUID id) {
        log.debug("REST request to delete SLABlock : {}", id);
        sLABlockRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
