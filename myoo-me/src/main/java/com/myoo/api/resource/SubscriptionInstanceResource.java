package com.myoo.api.resource;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.myoo.api.dao.SubscriptionDao;
import com.myoo.api.domain.Subscription;
import com.myoo.api.service.SecurityService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class SubscriptionInstanceResource {

	@Inject
	private SubscriptionDao subscriptionDao;

	@Inject
	private SecurityService userAccessService;

	@GET
	public Subscription read(@PathParam("subscriptionId") String subscriptionId) {
		return subscriptionDao.get(subscriptionId);
	}

	@DELETE
	public Subscription delete(@PathParam("subscriptionId") String subscriptionId) {
		Subscription subscription = subscriptionDao.get(subscriptionId);
		if (subscription == null) {
			throw new IllegalArgumentException("No Subscription found for that subscriptionId");
		} else if (!userAccessService.isSelf(subscription.getUserId())) {
			throw new SecurityException("User cannot delete Subscriptions for other Users");
		} else {
			// delete all subscriptions that match the projectId (effectively dupes)
			subscriptionDao.deleteByProjectId(subscription.getProjectId());
			return subscription;
		}
	}
}
