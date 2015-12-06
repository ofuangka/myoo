package com.myoo.api.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.myoo.api.domain.Record;
import com.myoo.api.support.GoogleDatastoreDao;
import com.myoo.api.support.GoogleDatastoreEntityMapper;

public class GoogleRecordDao extends GoogleDatastoreDao<Record> implements RecordDao {

	private static final String KIND_RECORD = "Record";
	private static final String KEY_ACHIEVEMENT_ID = "achievementId";
	private static final String KEY_POINTS = "points";
	private static final String KEY_TS = "ts";
	private static final String KEY_HASHED_USER_ID = "hashedUserId";

	private static final GoogleDatastoreEntityMapper<Record> recordMapper = new GoogleDatastoreEntityMapper<Record>() {

		@Override
		public Record map(Entity e) {
			Record ret = new Record();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setAchievementId((String) e.getProperty(KEY_ACHIEVEMENT_ID));
			ret.setPoints(((Long) e.getProperty(KEY_POINTS)).intValue());
			ret.setTs((Date) e.getProperty(KEY_TS));
			ret.setUserId((String) e.getProperty(KEY_HASHED_USER_ID));
			return ret;
		}

		@Override
		public void map(Record from, Entity to) {
			to.setProperty(KEY_ACHIEVEMENT_ID, from.getAchievementId());
			to.setProperty(KEY_POINTS, from.getPoints());
			to.setProperty(KEY_TS, from.getTs());
			to.setProperty(KEY_HASHED_USER_ID, from.getUserId());
		}

	};

	@Override
	public List<Record> getByUserId(String userId) {
		Query query = new Query(KIND_RECORD);
		query.setFilter(new FilterPredicate(KEY_HASHED_USER_ID, FilterOperator.EQUAL, userId));
		return recordMapper.map(getDatastore().prepare(query).asIterable());
	}

	@Override
	protected GoogleDatastoreEntityMapper<Record> getMapper() {
		return recordMapper;
	}

	@Override
	protected String getKind() {
		return KIND_RECORD;
	}

	public List<Record> getByAchievementId(String achievementId) {
		Query query = new Query(KIND_RECORD);
		query.setFilter(new FilterPredicate(KEY_ACHIEVEMENT_ID, FilterOperator.EQUAL, achievementId));
		return recordMapper.map(getDatastore().prepare(query).asIterable());
	}

	@Override
	public void deleteByAchievementId(String achievementId) {
		List<Record> recordsToDelete = getByAchievementId(achievementId);
		if (recordsToDelete != null) {
			List<Key> keys = new ArrayList<Key>();
			for (Record record : recordsToDelete) {
				keys.add(KeyFactory.stringToKey(record.getId()));
			}
			getDatastore().delete(keys);
		}

	}

}
