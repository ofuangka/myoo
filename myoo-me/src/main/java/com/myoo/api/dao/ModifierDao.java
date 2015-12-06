package com.myoo.api.dao;

import java.util.List;

import com.myoo.api.domain.Modifier;

public interface ModifierDao {
	
	Modifier get(String modifierId);

	List<Modifier> all();

	List<Modifier> getByProjectId(String projectId);

	Modifier create(Modifier modifier);

	Modifier update(Modifier modifier);

	Modifier delete(String modifierId);
}
