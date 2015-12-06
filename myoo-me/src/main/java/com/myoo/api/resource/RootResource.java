package com.myoo.api.resource;

import javax.ws.rs.Path;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;

@Path("/")
public class RootResource {

	@Context
	private ResourceContext context;

	@Path("/projects")
	public ProjectCollectionResource getProjectCollectionResource() {
		return context.getResource(ProjectCollectionResource.class);
	}

	@Path("/subscriptions")
	public SubscriptionCollectionResource getSubscriptionCollectionResource() {
		return context.getResource(SubscriptionCollectionResource.class);
	}

	@Path("/achievements")
	public AchievementCollectionResource getAchievementCollectionResource() {
		return context.getResource(AchievementCollectionResource.class);
	}
}
