package com.myoo.api.resource;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

@Path("/")
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
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

	@Path("/records")
	public RecordCollectionResource getRecordCollectionResource() {
		return context.getResource(RecordCollectionResource.class);
	}
}
