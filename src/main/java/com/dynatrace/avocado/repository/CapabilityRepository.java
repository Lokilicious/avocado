package com.dynatrace.avocado.repository;

import com.dynatrace.avocado.domain.Capability;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Capability entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CapabilityRepository extends JpaRepository<Capability, UUID> {}
