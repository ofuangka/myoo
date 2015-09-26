package com.myoo.api.project;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;

public class ProjectInstanceResource {

	@Inject
	private ProjectService projectService;

	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Project update(@PathParam("projectId") String projectId, @Valid Project project) {
		project.setId(projectId);
		return projectService.update(project);
	}

}
