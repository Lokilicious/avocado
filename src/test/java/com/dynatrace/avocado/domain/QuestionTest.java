package com.dynatrace.avocado.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dynatrace.avocado.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class QuestionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Question.class);
        Question question1 = new Question();
        question1.setId(UUID.randomUUID());
        Question question2 = new Question();
        question2.setId(question1.getId());
        assertThat(question1).isEqualTo(question2);
        question2.setId(UUID.randomUUID());
        assertThat(question1).isNotEqualTo(question2);
        question1.setId(null);
        assertThat(question1).isNotEqualTo(question2);
    }
}
