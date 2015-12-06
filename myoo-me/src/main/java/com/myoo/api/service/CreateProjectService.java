package com.myoo.api.service;

import com.myoo.api.domain.Project;

public interface CreateProjectService {

	/**
	 * Creates a {@link Project}, creates the {@link Achievement}s, then creates
	 * a {@link Subscription} for the current user
	 * 
	 * @param project
	 * @return
	 */
	Project createProject(Project project);
}
