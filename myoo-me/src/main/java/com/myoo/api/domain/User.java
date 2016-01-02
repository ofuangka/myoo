package com.myoo.api.domain;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class User {

	private String username;
	private String logoutUrl;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getLogoutUrl() {
		return logoutUrl;
	}

	public void setLogoutUrl(String logoutUrl) {
		this.logoutUrl = logoutUrl;
	}

}
