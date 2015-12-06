package com.myoo.api.dao;

import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.myoo.api.domain.Modifier;
import com.myoo.api.support.GoogleDatastoreDao;
import com.myoo.api.support.GoogleDatastoreEntityMapper;

@Named
public class GoogleModifierDao extends GoogleDatastoreDao<Modifier> implements ModifierDao {

	private static final String KIND_MODIFIER = "Modifier";
	private static final String KEY_PROJECT_ID = "projectId";
	private static final String KEY_USER_ID = "hashedUserId";

	private static final GoogleDatastoreEntityMapper<Modifier> modifierMapper = new GoogleDatastoreEntityMapper<Modifier>() {

		@Override
		public Modifier map(Entity e) {
			Modifier ret = new Modifier();
			ret.setId(KeyFactory.keyToString(e.getKey()));
			ret.setProjectId((String) e.getProperty(KEY_PROJECT_ID));
			ret.setUserId((String) e.getProperty(KEY_USER_ID));
			return ret;
		}

		@Override
		public void map(Modifier from, Entity to) {
			to.setProperty(KEY_PROJECT_ID, from.getProjectId());
			to.setProperty(KEY_USER_ID, from.getUserId());
		}

	};

	@Override
	public List<Modifier> getByProjectId(String projectId) {
		Query query = new Query(KIND_MODIFIER);
		query.setFilter(new FilterPredicate(KEY_PROJECT_ID, FilterOperator.EQUAL, projectId));
		return modifierMapper.map(getDatastore().prepare(query).asIterable());
	}

	@Override
	protected GoogleDatastoreEntityMapper<Modifier> getMapper() {
		return modifierMapper;
	}

	@Override
	protected String getKind() {
		return KIND_MODIFIER;
	}

}
