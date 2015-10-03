package com.myoo.api.datastore;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;

/**
 * Base class for GoogleDatastoreService classes
 * 
 * @author ofuangka
 *
 */
public class GoogleDatastoreService {

	protected DatastoreService getDatastore() {
		return DatastoreServiceFactory.getDatastoreService();
	}
}
