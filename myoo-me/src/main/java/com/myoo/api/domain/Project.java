package com.myoo.api.domain;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

import com.myoo.api.support.HasId;

@XmlRootElement
public class Project extends HasId {
	private List<Achievement> achievements;

	@NotNull
	@Size(min = 1, max = 100)
	private String name;

	@Size(max = 100)
	private String description;

	@Null
	private String createdBy;

	@Null
	private Date createdTs;

	@Null
	private Date lastUpdatedTs;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Achievement> getAchievements() {
		return achievements;
	}

	public void setAchievements(List<Achievement> achievements) {
		this.achievements = achievements;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public Date getCreatedTs() {
		return createdTs;
	}

	public void setCreatedTs(Date createdTs) {
		this.createdTs = createdTs;
	}

	public Date getLastUpdatedTs() {
		return lastUpdatedTs;
	}

	public void setLastUpdatedTs(Date lastUpdatedTs) {
		this.lastUpdatedTs = lastUpdatedTs;
	}
}
