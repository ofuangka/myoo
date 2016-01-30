package com.myoo.api.service;

public interface SecurityService {

	String getUserId();

	boolean isUserAllowedToEditProject(String projectId);
	
	boolean isUserAllowedToEditAchievement(String achievementId);

	boolean isSelf(String userId);

	String getUsername();

	String getLogoutUrl(String afterUrl);
}
