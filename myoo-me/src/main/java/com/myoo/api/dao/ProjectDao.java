package com.myoo.api.dao;

import java.util.List;

import com.myoo.api.domain.Project;

public interface ProjectDao {

	Project get(String projectId);

	/**
	 * Retrieves and returns all projects in the system
	 * 
	 * @return
	 */
	List<Project> all();

	/**
	 * Retrieves the projects that the user is subscribed to
	 * 
	 * @param userId
	 *            The id of the user to retrieve projects for
	 */
	List<Project> getByUserId(String userId);

	/**
	 * Updates and returns the given project. Returns null if something went
	 * wrong
	 * 
	 * @param project
	 * @return
	 */
	Project update(Project project);

	/**
	 * Creates and returns the given project. Returns null if something went
	 * wrong
	 * 
	 * @param project
	 * @return
	 */
	Project create(Project project);

	/**
	 * Deletes the given {@link Project}
	 * 
	 * @param projectId
	 * @return
	 */
	Project delete(String projectId);

}
