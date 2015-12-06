package com.myoo.api.resource;

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

import com.myoo.api.domain.Subscription;
import com.myoo.api.subscription.SubscriptionDao;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class SubscriptionCollectionResource {

	@Context
	private ResourceContext resourceContext;

	@Inject
	private SubscriptionDao subscriptionDao;
	
	@GET
	public List<Subscription> list() {
		return subscriptionDao.all();
	}

	@POST
	public Subscription create(@Valid Subscription subscription) {
		return subscriptionDao.create(subscription);
	}

	@Path("/{subscriptionId}")
	public SubscriptionInstanceResource getSubscriptionInstanceResource() {
		return resourceContext.getResource(SubscriptionInstanceResource.class);
	}
}
