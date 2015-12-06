package com.myoo.api.domain;

import java.util.Date;

import javax.validation.constraints.Null;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.validator.constraints.NotBlank;

import com.myoo.api.support.HasId;

@XmlRootElement
public class Record extends HasId {

	@NotBlank
	private String achievementId;
	
	@Null
	private String userId;

	@Size(min = 1, max = 100)
	private Integer points;

	@Null
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
