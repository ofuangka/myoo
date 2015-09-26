package com.myoo.api.project;

import java.util.List;

import javax.inject.Named;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Transaction;
import com.myoo.api.datastore.GoogleDatastoreEntityMapper;

@Named
public class GoogleDatastoreProjectService implements ProjectService {

	private static final String KIND_PROJECT = "Project";
	private static final String KEY_NAME = "name";
	private static final String KEY_DESCRIPTION = "description";

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

	private DatastoreService getDatastore() {
		return DatastoreServiceFactory.getDatastoreService();
	}

	@Override
	public List<Project> get() {
		return projectMapper.map(getDatastore().prepare(new Query(KIND_PROJECT)).asIterable());
	}

	public Project update(Project project) {
		Project ret = null;
		DatastoreService datastore = getDatastore();
		Transaction txn = datastore.beginTransaction();
		try {
			Key projectKey = KeyFactory.stringToKey(project.getId());
			Entity projectEntity = datastore.get(projectKey);
			projectMapper.map(project, projectEntity);
			datastore.put(projectEntity);
			txn.commit();
			ret = project;
		} catch (EntityNotFoundException e) {
			// do nothing
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			}
		}
		return ret;
	}

	public Project create(Project project) {
		DatastoreService datastore = getDatastore();
		Entity projectEntity = new Entity(KIND_PROJECT);
		projectMapper.map(project, projectEntity);
		Key key = datastore.put(projectEntity);
		project.setId(KeyFactory.keyToString(key));
		return project;
	}

}
