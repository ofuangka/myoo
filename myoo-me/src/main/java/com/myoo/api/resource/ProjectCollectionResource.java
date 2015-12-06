package com.myoo.api.resource;

import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.myoo.api.dao.ProjectDao;
import com.myoo.api.domain.Project;
import com.myoo.api.service.CreateProjectService;
import com.myoo.api.service.UserIdService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class ProjectCollectionResource {

	@Inject
	private ProjectDao projectDao;

	@Inject
	private CreateProjectService createProjectService;

	@Inject
	private UserIdService userIdService;

	@Context
	private ResourceContext context;

	@GET
	public List<Project> list(@QueryParam("own") boolean isOwn) {
		if (isOwn) {
			return projectDao.getByUserId(userIdService.getUserId());
		} else {
			return projectDao.all();
		}
	}

	@POST
	public Project create(@Valid Project project) {
		return createProjectService.createProject(project);
	}

	@Path("/{projectId}")
	public ProjectInstanceResource getProjectInstanceResource() {
		return context.getResource(ProjectInstanceResource.class);
	}
}
