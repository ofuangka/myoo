package com.myoo.api.domain;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.validator.constraints.NotBlank;

import com.myoo.api.support.HasId;

@XmlRootElement
public class Achievement extends HasId {

	private String projectId;

	@Size(min = 1, max = 20)
	private String name;

	@Size(min = 1, max = 50)
	private String description;

	@Min(1)
	@Max(999)
	private Integer points;

	@NotNull
	@NotBlank
	private String frequency;
	
	@NotNull
	@Min(0)
	private Integer spriteX;
	
	@NotNull
	@Min(0)
	private Integer spriteY;

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

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public String getFrequency() {
		return frequency;
	}

	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	
	public void setSpriteX(Integer spriteX) {
		this.spriteX = spriteX;
	}
	
	public Integer getSpriteX() {
		return spriteX;
	}
	
	public void setSpriteY(Integer spriteY) {
		this.spriteY = spriteY;
	}
	
	public Integer getSpriteY() {
		return spriteY;
	}
}
