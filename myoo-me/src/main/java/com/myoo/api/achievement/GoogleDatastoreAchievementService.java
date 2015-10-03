package com.myoo.api.achievement;

import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Transaction;
import com.myoo.api.datastore.GoogleDatastoreEntityMapper;
import com.myoo.api.datastore.GoogleDatastoreService;

@Named
public class GoogleDatastoreAchievementService extends GoogleDatastoreService implements AchievementService {

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
			ret.setPoints((Integer) e.getProperty(KEY_POINTS));
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
	public List<Achievement> query(String projectId) {
		Query query = new Query(KIND_ACHIEVEMENT);
		query.setFilter(new FilterPredicate(KEY_PROJECT_ID, FilterOperator.EQUAL, projectId));
		return achievementMapper.map(getDatastore().prepare(query).asIterable());
	}

	@Override
	public Achievement create(Achievement achievement) {
		DatastoreService datastore = getDatastore();
		Entity entity = new Entity(KIND_ACHIEVEMENT);
		achievementMapper.map(achievement, entity);
		Key key = datastore.put(entity);
		achievement.setId(KeyFactory.keyToString(key));
		return achievement;
	}

	@Override
	public Achievement update(Achievement achievement) {
		Achievement ret = null;
		DatastoreService datastore = getDatastore();
		Transaction txn = datastore.beginTransaction();
		try {
			Key achievementKey = KeyFactory.stringToKey(achievement.getId());
			Entity achievementEntity = datastore.get(achievementKey);
			achievementMapper.map(achievement, achievementEntity);
			datastore.put(achievementEntity);
			txn.commit();
			ret = achievement;
		} catch (EntityNotFoundException e) {
			// do nothing
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			}
		}
		return ret;
	}

}
