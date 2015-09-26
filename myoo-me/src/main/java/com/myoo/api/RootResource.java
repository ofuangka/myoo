package com.myoo.api;

import javax.ws.rs.Path;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;

import com.myoo.api.project.ProjectCollectionResource;

@Path("/")
public class RootResource {

	@Context
	private ResourceContext context;

	@Path("/projects")
	public ProjectCollectionResource getProjectCollectionResource() {
		return context.getResource(ProjectCollectionResource.class);
	}
}
