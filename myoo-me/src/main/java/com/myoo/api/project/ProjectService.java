package com.myoo.api.project;

import java.util.List;

public interface ProjectService {

	/**
	 * Retrieves and returns all projects in the system
	 * 
	 * @return
	 */
	public List<Project> query();

	/**
	 * Updates and returns the given project. Returns null if something went
	 * wrong
	 * 
	 * @param project
	 * @return
	 */
	public Project update(Project project);

	/**
	 * Creates and returns the given project. Returns null if something went
	 * wrong
	 * 
	 * @param project
	 * @return
	 */
	public Project create(Project project);

}
