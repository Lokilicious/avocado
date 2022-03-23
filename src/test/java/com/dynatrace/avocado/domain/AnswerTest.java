package com.dynatrace.avocado.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dynatrace.avocado.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class AnswerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Answer.class);
        Answer answer1 = new Answer();
        answer1.setId(UUID.randomUUID());
        Answer answer2 = new Answer();
        answer2.setId(answer1.getId());
        assertThat(answer1).isEqualTo(answer2);
        answer2.setId(UUID.randomUUID());
        assertThat(answer1).isNotEqualTo(answer2);
        answer1.setId(null);
        assertThat(answer1).isNotEqualTo(answer2);
    }
}
