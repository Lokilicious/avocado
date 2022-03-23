package com.dynatrace.avocado.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;

/**
 * A Survey.
 */
@Entity
@Table(name = "survey")
public class Survey implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "survey_date")
    private Instant surveyDate;

    @Column(name = "created_date")
    private Instant createdDate;

    @OneToMany(mappedBy = "survey")
    @JsonIgnoreProperties(value = { "question", "survey" }, allowSetters = true)
    private Set<Answer> answers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "surveys", "capability" }, allowSetters = true)
    private Team team;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Survey id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Instant getSurveyDate() {
        return this.surveyDate;
    }

    public Survey surveyDate(Instant surveyDate) {
        this.setSurveyDate(surveyDate);
        return this;
    }

    public void setSurveyDate(Instant surveyDate) {
        this.surveyDate = surveyDate;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Survey createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Set<Answer> getAnswers() {
        return this.answers;
    }

    public void setAnswers(Set<Answer> answers) {
        if (this.answers != null) {
            this.answers.forEach(i -> i.setSurvey(null));
        }
        if (answers != null) {
            answers.forEach(i -> i.setSurvey(this));
        }
        this.answers = answers;
    }

    public Survey answers(Set<Answer> answers) {
        this.setAnswers(answers);
        return this;
    }

    public Survey addAnswer(Answer answer) {
        this.answers.add(answer);
        answer.setSurvey(this);
        return this;
    }

    public Survey removeAnswer(Answer answer) {
        this.answers.remove(answer);
        answer.setSurvey(null);
        return this;
    }

    public Team getTeam() {
        return this.team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Survey team(Team team) {
        this.setTeam(team);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Survey)) {
            return false;
        }
        return id != null && id.equals(((Survey) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Survey{" +
            "id=" + getId() +
            ", surveyDate='" + getSurveyDate() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
