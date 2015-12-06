package com.myoo.api.domain;

import javax.xml.bind.annotation.XmlRootElement;

import com.myoo.api.support.HasId;

@XmlRootElement
public class Modifier extends HasId {

	private String userId;
	private String projectId;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
}
