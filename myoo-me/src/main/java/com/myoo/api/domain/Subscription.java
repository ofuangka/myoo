package com.myoo.api.domain;

import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.validator.constraints.NotBlank;

import com.myoo.api.support.HasId;

@XmlRootElement
public class Subscription extends HasId {

	@NotBlank
	private String projectId;

	@NotBlank
	private String userId;

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
}
