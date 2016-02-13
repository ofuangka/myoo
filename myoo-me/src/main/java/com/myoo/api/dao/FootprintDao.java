package com.myoo.api.dao;

import com.myoo.api.domain.Footprint;

public interface FootprintDao {

	Footprint create(Footprint footprint);

	Footprint update(Footprint footprint);

	Footprint getFirstByUserId(String userId);
}
