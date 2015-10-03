package com.myoo.api.project;

import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

public class ProjectCollectionResource {

	@Inject
	private ProjectService projectService;

	@Context
	private ResourceContext context;

	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Project> list() {
		return projectService.get();
	}

	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Project create(@Valid Project project) {
		return projectService.create(project);
	}
	
	@Path("/{projectId}")
	public ProjectInstanceResource getProjectInstanceResource() {
		return context.getResource(ProjectInstanceResource.class);
	}
}
