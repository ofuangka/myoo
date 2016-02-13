package com.myoo.api.dao;

import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.myoo.api.domain.Footprint;
import com.myoo.api.support.GoogleDatastoreDao;
import com.myoo.api.support.GoogleDatastoreEntityMapper;

@Named
public class GoogleFootprintDao extends GoogleDatastoreDao<Footprint> implements FootprintDao {

	private static final String KIND_FOOTPRINT = "footprint";

	private static final String KEY_HASHED_USER_ID = "hashedUserId";
	private static final String KEY_USERNAME = "username";

	private GoogleDatastoreEntityMapper<Footprint> footprintMapper = new GoogleDatastoreEntityMapper<Footprint>() {

		@Override
		public Footprint map(Entity e) {
			Footprint ret = new Footprint();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setUserId((String) e.getProperty(KEY_HASHED_USER_ID));
			ret.setUsername((String) e.getProperty(KEY_USERNAME));
			return ret;
		}

		@Override
		public void map(Footprint from, Entity to) {
			to.setProperty(KEY_HASHED_USER_ID, from.getUserId());
			to.setProperty(KEY_USERNAME, from.getUsername());
		}
	};

	private List<Footprint> getByUserId(String userId) {
		Query query = new Query(KIND_FOOTPRINT);
		query.setFilter(new FilterPredicate(KEY_HASHED_USER_ID, FilterOperator.EQUAL, userId));
		return footprintMapper.map(getDatastore().prepare(query).asIterable());
	}

	public Footprint getFirstByUserId(String userId) {
		List<Footprint> l = getByUserId(userId);
		return (l.isEmpty()) ? null : l.get(0);
	}

	@Override
	protected GoogleDatastoreEntityMapper<Footprint> getMapper() {
		return footprintMapper;
	}

	@Override
	protected String getKind() {
		return KIND_FOOTPRINT;
	}

}
