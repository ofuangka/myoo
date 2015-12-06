package com.myoo.api.domain;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

import com.myoo.api.support.HasId;

@XmlRootElement
public class Record extends HasId {

	private String achievementId;
	private String userId;
	private Integer points;
	private Date ts;

	public String getAchievementId() {
		return achievementId;
	}

	public void setAchievementId(String achievementId) {
		this.achievementId = achievementId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public Date getTs() {
		return ts;
	}

	public void setTs(Date ts) {
		this.ts = ts;
	}
}
