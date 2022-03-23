package com.dynatrace.avocado.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.dynatrace.avocado.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class TeamTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Team.class);
        Team team1 = new Team();
        team1.setId(UUID.randomUUID());
        Team team2 = new Team();
        team2.setId(team1.getId());
        assertThat(team1).isEqualTo(team2);
        team2.setId(UUID.randomUUID());
        assertThat(team1).isNotEqualTo(team2);
        team1.setId(null);
        assertThat(team1).isNotEqualTo(team2);
    }
}
