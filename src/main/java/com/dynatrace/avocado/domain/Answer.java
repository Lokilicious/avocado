package com.dynatrace.avocado.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;

/**
 * A Answer.
 */
@Entity
@Table(name = "answer")
public class Answer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "num_responses")
    private Long numResponses;

    @Column(name = "result_numeric")
    private Double resultNumeric;

    @Column(name = "result_string")
    private String resultString;

    @Column(name = "jhi_order")
    private Long order;

    @ManyToOne
    @JsonIgnoreProperties(value = { "slaBlock" }, allowSetters = true)
    private Question question;

    @ManyToOne
    @JsonIgnoreProperties(value = { "answers", "team" }, allowSetters = true)
    private Survey survey;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Answer id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Long getNumResponses() {
        return this.numResponses;
    }

    public Answer numResponses(Long numResponses) {
        this.setNumResponses(numResponses);
        return this;
    }

    public void setNumResponses(Long numResponses) {
        this.numResponses = numResponses;
    }

    public Double getResultNumeric() {
        return this.resultNumeric;
    }

    public Answer resultNumeric(Double resultNumeric) {
        this.setResultNumeric(resultNumeric);
        return this;
    }

    public void setResultNumeric(Double resultNumeric) {
        this.resultNumeric = resultNumeric;
    }

    public String getResultString() {
        return this.resultString;
    }

    public Answer resultString(String resultString) {
        this.setResultString(resultString);
        return this;
    }

    public void setResultString(String resultString) {
        this.resultString = resultString;
    }

    public Long getOrder() {
        return this.order;
    }

    public Answer order(Long order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(Long order) {
        this.order = order;
    }

    public Question getQuestion() {
        return this.question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Answer question(Question question) {
        this.setQuestion(question);
        return this;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }

    public Answer survey(Survey survey) {
        this.setSurvey(survey);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Answer)) {
            return false;
        }
        return id != null && id.equals(((Answer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Answer{" +
            "id=" + getId() +
            ", numResponses=" + getNumResponses() +
            ", resultNumeric=" + getResultNumeric() +
            ", resultString='" + getResultString() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
