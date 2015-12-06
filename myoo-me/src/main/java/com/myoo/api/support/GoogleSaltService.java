package com.myoo.api.support;

import javax.inject.Named;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Query;

@Named
public class GoogleSaltService {

	private static final String KIND_SALT = "Salt";
	private static final String KEY_VALUE = "value";

	private String salt;

	public GoogleSaltService() {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query query = new Query(KIND_SALT);
		salt = (String) datastore.prepare(query).asSingleEntity().getProperty(KEY_VALUE);
	}

	public String getSalt() {
		return salt;
	}
}
