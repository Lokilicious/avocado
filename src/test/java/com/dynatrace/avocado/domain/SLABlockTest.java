package com.dynatrace.avocado.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dynatrace.avocado.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class SLABlockTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SLABlock.class);
        SLABlock sLABlock1 = new SLABlock();
        sLABlock1.setId(UUID.randomUUID());
        SLABlock sLABlock2 = new SLABlock();
        sLABlock2.setId(sLABlock1.getId());
        assertThat(sLABlock1).isEqualTo(sLABlock2);
        sLABlock2.setId(UUID.randomUUID());
        assertThat(sLABlock1).isNotEqualTo(sLABlock2);
        sLABlock1.setId(null);
        assertThat(sLABlock1).isNotEqualTo(sLABlock2);
    }
}
