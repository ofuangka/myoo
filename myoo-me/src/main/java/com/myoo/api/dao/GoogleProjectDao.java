package com.myoo.api.dao;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.Predicate;
import org.apache.commons.lang3.StringUtils;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.myoo.api.domain.Project;
import com.myoo.api.domain.Subscription;
import com.myoo.api.support.GoogleDatastoreDao;
import com.myoo.api.support.GoogleDatastoreEntityMapper;

@Named
public class GoogleProjectDao extends GoogleDatastoreDao<Project> implements ProjectDao {

	private static final String KIND_PROJECT = "Project";
	private static final String KEY_NAME = "name";
	private static final String KEY_DESCRIPTION = "description";

	@Inject
	private SubscriptionDao subscriptionService;

	private static final GoogleDatastoreEntityMapper<Project> projectMapper = new GoogleDatastoreEntityMapper<Project>() {

		@Override
		public Project map(Entity e) {
			Project ret = new Project();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setName((String) e.getProperty(KEY_NAME));
			ret.setDescription((String) e.getProperty(KEY_DESCRIPTION));
			return ret;
		}

		@Override
		public void map(Project from, Entity to) {
			to.setProperty(KEY_NAME, from.getName());
			to.setProperty(KEY_DESCRIPTION, from.getDescription());
		}
	};

	/**
	 * This gets all the projects, then filters them down to only the ones the
	 * user is subscribed to.
	 */
	public List<Project> getByUserId(String userId) {
		List<Project> ret = all();
		final List<Subscription> subscriptions = subscriptionService.getByUserId(userId);
		CollectionUtils.filter(ret, new Predicate<Project>() {

			@Override
			public boolean evaluate(Project project) {
				boolean ret = false;
				for (Subscription subscription : subscriptions) {
					if (StringUtils.equals(subscription.getProjectId(), project.getId())) {
						ret = true;
						break;
					}
				}
				return ret;
			}
		});
		return ret;

	}

	@Override
	protected GoogleDatastoreEntityMapper<Project> getMapper() {
		return projectMapper;
	}

	@Override
	protected String getKind() {
		return KIND_PROJECT;
	}
}
