package com.myoo.api.resource;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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

	@POST
	public Subscription update(@PathParam("subscriptionId") String subscriptionId, @Valid Subscription subscription) {
		if (userAccessService.isSelf(subscriptionDao.get(subscriptionId).getUserId())) {
			subscription.setId(subscriptionId);
			return subscriptionDao.update(subscription);
		} else {
			throw new SecurityException("User cannot update Subscriptions for other Users");
		}
	}

	@DELETE
	public Subscription delete(@PathParam("subscriptionId") String subscriptionId) {
		if (userAccessService.isSelf(subscriptionDao.get(subscriptionId).getUserId())) {
			return subscriptionDao.delete(subscriptionId);
		} else {
			throw new SecurityException("User cannto delete Subscriptions for other Users");
		}
	}
}
