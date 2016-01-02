package com.myoo.api.service;

public interface SecurityService {

	String getUserId();

	boolean isUserAllowed(String projectId);

	boolean isSelf(String userId);

	String getUsername();

	String getLogoutUrl(String afterUrl);
}
