package com.myoo.api.subscription;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.myoo.api.domain.Subscription;
import com.myoo.api.support.GoogleDatastoreDao;
import com.myoo.api.support.GoogleDatastoreEntityMapper;

@Named
public class GoogleSubscriptionDao extends GoogleDatastoreDao<Subscription> implements SubscriptionDao {

	private static final String KIND_SUBSCRIPTION = "Subscription";
	private static final String KEY_PROJECT_ID = "projectId";
	private static final String KEY_USER_ID = "userId";

	private static final GoogleDatastoreEntityMapper<Subscription> subscriptionMapper = new GoogleDatastoreEntityMapper<Subscription>() {

		@Override
		public Subscription map(Entity e) {
			Subscription ret = new Subscription();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setProjectId((String) e.getProperty(KEY_PROJECT_ID));
			ret.setUserId((String) e.getProperty(KEY_USER_ID));
			return ret;
		}

		@Override
		public void map(Subscription from, Entity to) {
			to.setProperty(KEY_PROJECT_ID, from.getProjectId());
			to.setProperty(KEY_USER_ID, from.getUserId());
		}

	};

	public List<Subscription> getByUserId(String userId) {
		Query query = new Query(KIND_SUBSCRIPTION);
		query.setFilter(new FilterPredicate(KEY_USER_ID, FilterOperator.EQUAL, userId));
		return subscriptionMapper.map(getDatastore().prepare(query).asIterable());
	}

	public List<Subscription> getByProjectId(String projectId) {
		Query query = new Query(KIND_SUBSCRIPTION);
		query.setFilter(new FilterPredicate(KEY_PROJECT_ID, FilterOperator.EQUAL, projectId));
		return subscriptionMapper.map(getDatastore().prepare(query).asIterable());
	}

	@Override
	protected GoogleDatastoreEntityMapper<Subscription> getMapper() {
		return subscriptionMapper;
	}

	@Override
	protected String getKind() {
		return KIND_SUBSCRIPTION;
	}

	@Override
	public void deleteByProjectId(String projectId) {
		List<Subscription> subscriptionsToDelete = getByProjectId(projectId);
		if (subscriptionsToDelete != null) {
			List<Key> keys = new ArrayList<Key>();
			for (Subscription subscription : subscriptionsToDelete) {
				keys.add(KeyFactory.stringToKey(subscription.getId()));
			}
			getDatastore().delete(keys);
		}
	}

}
