package com.myoo.api.dao;

import java.util.List;

import com.myoo.api.domain.Subscription;

public interface SubscriptionDao {

	Subscription get(String subscriptionId);

	List<Subscription> all();

	List<Subscription> getByUserId(String userId);

	Subscription create(Subscription subscription);

	Subscription update(Subscription subscription);

	Subscription delete(String subscriptionId);

	void deleteByProjectId(String projectId);
	
	List<Subscription> getByProjectId(String projectId);

}
