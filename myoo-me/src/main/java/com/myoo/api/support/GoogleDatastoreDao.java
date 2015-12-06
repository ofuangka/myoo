package com.myoo.api.support;

import java.util.List;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Transaction;

/**
 * Base class for GoogleDatastoreService classes
 * 
 * @author ofuangka
 *
 */
public abstract class GoogleDatastoreDao<T extends HasId> {

	protected DatastoreService getDatastore() {
		return DatastoreServiceFactory.getDatastoreService();
	}

	protected abstract GoogleDatastoreEntityMapper<T> getMapper();

	protected abstract String getKind();

	public T get(String id) {
		T ret = null;
		try {
			ret = getMapper().map(getDatastore().get(KeyFactory.stringToKey(id)));
		} catch (EntityNotFoundException e) {
			// do nothing
		}
		return ret;
	}

	public List<T> all() {
		return getMapper().map(getDatastore().prepare(new Query(getKind())).asIterable());
	}

	public T create(T t) {
		DatastoreService datastore = getDatastore();
		Entity entity = new Entity(getKind());
		getMapper().map(t, entity);
		Key key = datastore.put(entity);
		t.setId(KeyFactory.keyToString(key));
		return t;

	}

	public T update(T t) {
		T ret = null;
		DatastoreService datastore = getDatastore();
		Transaction txn = datastore.beginTransaction();
		try {
			Key key = KeyFactory.stringToKey(t.getId());
			Entity entity = datastore.get(key);
			getMapper().map(t, entity);
			datastore.put(entity);
			txn.commit();
			ret = t;
		} catch (EntityNotFoundException e) {
			// do nothing
		} finally {
			if (txn.isActive()) {
				txn.rollback();
			}
		}
		return ret;
	}

	public T delete(String id) {
		T ret = null;
		DatastoreService datastore = getDatastore();
		Key key = KeyFactory.stringToKey(id);
		Transaction txn = datastore.beginTransaction();
		Entity entity;
		try {
			entity = datastore.get(key);
			ret = getMapper().map(entity);
			datastore.delete(key);
			txn.commit();
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
