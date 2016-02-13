package com.myoo.api.resource;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;

import com.myoo.api.dao.FootprintDao;
import com.myoo.api.domain.Footprint;
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

	@Inject
	private FootprintDao footprintDao;

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
		String userId = securityService.getUserId();
		String username = securityService.getUsername();
		String logoutUrl = securityService.getLogoutUrl(URL_LOGOUT_REDIRECT);

		/* we want to save the user's username in a Footprint object */
		Footprint footprint = footprintDao.getFirstByUserId(userId);
		if (footprint != null) {

			/*
			 * a user may have changed their username, so we check for that and
			 * update their footprint if it did
			 */
			if (StringUtils.equals(footprint.getUsername(), username)) {
				footprint.setUsername(username);
				footprintDao.update(footprint);
			} else {

				/*
				 * if the username didn't change then our info is up to date and
				 * we don't have to do anything
				 */
			}
		} else {

			/*
			 * if this is the first time we've seen this user, create a
			 * Footprint for them
			 */
			footprint = new Footprint();
			footprint.setUserId(userId);
			footprint.setUsername(username);
			footprintDao.create(footprint);
		}

		User ret = new User();
		ret.setId(userId);
		ret.setUsername(username);
		ret.setLogoutUrl(logoutUrl);
		return ret;
	}
}
