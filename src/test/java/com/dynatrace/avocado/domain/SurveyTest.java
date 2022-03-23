package com.dynatrace.avocado.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dynatrace.avocado.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class SurveyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Survey.class);
        Survey survey1 = new Survey();
        survey1.setId(UUID.randomUUID());
        Survey survey2 = new Survey();
        survey2.setId(survey1.getId());
        assertThat(survey1).isEqualTo(survey2);
        survey2.setId(UUID.randomUUID());
        assertThat(survey1).isNotEqualTo(survey2);
        survey1.setId(null);
        assertThat(survey1).isNotEqualTo(survey2);
    }
}
