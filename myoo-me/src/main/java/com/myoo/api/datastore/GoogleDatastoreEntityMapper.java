package com.myoo.api.datastore;

import java.util.ArrayList;
import java.util.List;

import com.google.appengine.api.datastore.Entity;

public abstract class GoogleDatastoreEntityMapper<T> {
	public List<T> map(Iterable<Entity> iter) {
		List<T> ret = new ArrayList<T>();
		for (Entity e : iter) {
			ret.add(map(e));
		}
		return ret;
	}

	public abstract T map(Entity e);
	public abstract void map(T from, Entity to);
}
