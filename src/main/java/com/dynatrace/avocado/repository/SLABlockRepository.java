package com.dynatrace.avocado.repository;

import com.dynatrace.avocado.domain.SLABlock;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SLABlock entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SLABlockRepository extends JpaRepository<SLABlock, UUID> {}
