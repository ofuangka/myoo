package com.myoo.api.dao;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.myoo.api.domain.Achievement;
import com.myoo.api.support.GoogleDatastoreDao;
import com.myoo.api.support.GoogleDatastoreEntityMapper;

@Named
public class GoogleAchievementDao extends GoogleDatastoreDao<Achievement> implements AchievementDao {

	private static final String KIND_ACHIEVEMENT = "Achievement";

	private static final String KEY_PROJECT_ID = "projectId";
	private static final String KEY_NAME = "name";
	private static final String KEY_DESCRIPTION = "description";
	private static final String KEY_POINTS = "points";
	private static final String KEY_FREQUENCY = "frequency";

	private GoogleDatastoreEntityMapper<Achievement> achievementMapper = new GoogleDatastoreEntityMapper<Achievement>() {

		@Override
		public Achievement map(Entity e) {
			Achievement ret = new Achievement();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setProjectId((String) e.getProperty(KEY_PROJECT_ID));
			ret.setName((String) e.getProperty(KEY_NAME));
			ret.setDescription((String) e.getProperty(KEY_DESCRIPTION));
			ret.setPoints(((Long) e.getProperty(KEY_POINTS)).intValue());
			ret.setFrequency((String) e.getProperty(KEY_FREQUENCY));
			return ret;
		}

		@Override
		public void map(Achievement from, Entity to) {
			to.setProperty(KEY_PROJECT_ID, from.getProjectId());
			to.setProperty(KEY_NAME, from.getName());
			to.setProperty(KEY_DESCRIPTION, from.getDescription());
			to.setProperty(KEY_POINTS, from.getPoints());
			to.setProperty(KEY_FREQUENCY, from.getFrequency());
		}

	};

	@Override
	public List<Achievement> getByProjectId(String projectId) {
		Query query = new Query(KIND_ACHIEVEMENT);
		query.setFilter(new FilterPredicate(KEY_PROJECT_ID, FilterOperator.EQUAL, projectId));
		return achievementMapper.map(getDatastore().prepare(query).asIterable());
	}

	@Override
	protected GoogleDatastoreEntityMapper<Achievement> getMapper() {
		return achievementMapper;
	}

	@Override
	protected String getKind() {
		return KIND_ACHIEVEMENT;
	}

	@Override
	public void deleteByProjectId(String projectId) {
		List<Achievement> achievementsToDelete = getByProjectId(projectId);
		if (achievementsToDelete != null) {
			List<Key> keys = new ArrayList<Key>();
			for (Achievement achievementToDelete : achievementsToDelete) {
				keys.add(KeyFactory.stringToKey(achievementToDelete.getId()));
			}
			getDatastore().delete(keys);
		}
	}

}
