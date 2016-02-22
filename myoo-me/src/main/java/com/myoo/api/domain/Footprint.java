package com.myoo.api.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import com.myoo.api.support.HasId;

@XmlRootElement
public class Footprint extends HasId {

	private String userId;
	private String username;
	private Date ts;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	public Date getTs() {
		return ts;
	}
	
	public void setTs(Date ts) {
		this.ts = ts;
	}

}
