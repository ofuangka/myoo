package com.myoo.api.resource;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.myoo.api.domain.User;
import com.myoo.api.service.SecurityService;

@Path("/")
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class RootResource {

	private static final String URL_LOGOUT_REDIRECT = "http://myoo-me.appspot.com/";

	@Context
	private ResourceContext context;

	@Inject
	private SecurityService securityService;

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

	@Path("/modifiers")
	public ModifierCollectionResource getModifierCollectionResource() {
		return context.getResource(ModifierCollectionResource.class);
	}

	@GET
	@Path("/users/self")
	public User getUser() {
		User ret = new User();
		ret.setId(securityService.getUserId());
		ret.setUsername(securityService.getUsername());
		ret.setLogoutUrl(securityService.getLogoutUrl(URL_LOGOUT_REDIRECT));
		return ret;
	}
}
