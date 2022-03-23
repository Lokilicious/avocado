package com.dynatrace.avocado.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;

/**
 * A Team.
 */
@Entity
@Table(name = "team")
public class Team implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "advocate")
    private String advocate;

    @Column(name = "coach")
    private String coach;

    @Column(name = "currently_coached")
    private Boolean currentlyCoached;

    @Column(name = "num_members")
    private Long numMembers;

    @Column(name = "created_date")
    private Instant createdDate;

    @OneToMany(mappedBy = "team")
    @JsonIgnoreProperties(value = { "answers", "team" }, allowSetters = true)
    private Set<Survey> surveys = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "teams" }, allowSetters = true)
    private Capability capability;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Team id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Team name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdvocate() {
        return this.advocate;
    }

    public Team advocate(String advocate) {
        this.setAdvocate(advocate);
        return this;
    }

    public void setAdvocate(String advocate) {
        this.advocate = advocate;
    }

    public String getCoach() {
        return this.coach;
    }

    public Team coach(String coach) {
        this.setCoach(coach);
        return this;
    }

    public void setCoach(String coach) {
        this.coach = coach;
    }

    public Boolean getCurrentlyCoached() {
        return this.currentlyCoached;
    }

    public Team currentlyCoached(Boolean currentlyCoached) {
        this.setCurrentlyCoached(currentlyCoached);
        return this;
    }

    public void setCurrentlyCoached(Boolean currentlyCoached) {
        this.currentlyCoached = currentlyCoached;
    }

    public Long getNumMembers() {
        return this.numMembers;
    }

    public Team numMembers(Long numMembers) {
        this.setNumMembers(numMembers);
        return this;
    }

    public void setNumMembers(Long numMembers) {
        this.numMembers = numMembers;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Team createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Set<Survey> getSurveys() {
        return this.surveys;
    }

    public void setSurveys(Set<Survey> surveys) {
        if (this.surveys != null) {
            this.surveys.forEach(i -> i.setTeam(null));
        }
        if (surveys != null) {
            surveys.forEach(i -> i.setTeam(this));
        }
        this.surveys = surveys;
    }

    public Team surveys(Set<Survey> surveys) {
        this.setSurveys(surveys);
        return this;
    }

    public Team addSurvey(Survey survey) {
        this.surveys.add(survey);
        survey.setTeam(this);
        return this;
    }

    public Team removeSurvey(Survey survey) {
        this.surveys.remove(survey);
        survey.setTeam(null);
        return this;
    }

    public Capability getCapability() {
        return this.capability;
    }

    public void setCapability(Capability capability) {
        this.capability = capability;
    }

    public Team capability(Capability capability) {
        this.setCapability(capability);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Team)) {
            return false;
        }
        return id != null && id.equals(((Team) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Team{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", advocate='" + getAdvocate() + "'" +
            ", coach='" + getCoach() + "'" +
            ", currentlyCoached='" + getCurrentlyCoached() + "'" +
            ", numMembers=" + getNumMembers() +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
