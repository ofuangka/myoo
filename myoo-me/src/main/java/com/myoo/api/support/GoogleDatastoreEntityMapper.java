package com.myoo.api.support;

import java.util.ArrayList;
import java.util.List;

import com.google.appengine.api.datastore.Entity;

public abstract class GoogleDatastoreEntityMapper<T> {
	/**
	 * Given at Iterable<Entity> iter, maps to a List of T
	 * 
	 * @param iter
	 * @return
	 */
	public List<T> map(Iterable<Entity> iter) {
		List<T> ret = new ArrayList<T>();
		for (Entity e : iter) {
			ret.add(map(e));
		}
		return ret;
	}

	/**
	 * Maps an Entity to the type T
	 * 
	 * @param e
	 * @return
	 */
	public abstract T map(Entity e);

	/**
	 * Maps a type T to an Entity without the ID
	 * 
	 * @param from
	 * @param to
	 */
	public abstract void map(T from, Entity to);
}
