package com.dynatrace.avocado.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dynatrace.avocado.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CapabilityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Capability.class);
        Capability capability1 = new Capability();
        capability1.setId(UUID.randomUUID());
        Capability capability2 = new Capability();
        capability2.setId(capability1.getId());
        assertThat(capability1).isEqualTo(capability2);
        capability2.setId(UUID.randomUUID());
        assertThat(capability1).isNotEqualTo(capability2);
        capability1.setId(null);
        assertThat(capability1).isNotEqualTo(capability2);
    }
}
