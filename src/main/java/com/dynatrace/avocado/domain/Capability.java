package com.dynatrace.avocado.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;

/**
 * A Capability.
 */
@Entity
@Table(name = "capability")
public class Capability implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "capability")
    @JsonIgnoreProperties(value = { "surveys", "capability" }, allowSetters = true)
    private Set<Team> teams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Capability id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Capability name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Team> getTeams() {
        return this.teams;
    }

    public void setTeams(Set<Team> teams) {
        if (this.teams != null) {
            this.teams.forEach(i -> i.setCapability(null));
        }
        if (teams != null) {
            teams.forEach(i -> i.setCapability(this));
        }
        this.teams = teams;
    }

    public Capability teams(Set<Team> teams) {
        this.setTeams(teams);
        return this;
    }

    public Capability addTeam(Team team) {
        this.teams.add(team);
        team.setCapability(this);
        return this;
    }

    public Capability removeTeam(Team team) {
        this.teams.remove(team);
        team.setCapability(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Capability)) {
            return false;
        }
        return id != null && id.equals(((Capability) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Capability{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
