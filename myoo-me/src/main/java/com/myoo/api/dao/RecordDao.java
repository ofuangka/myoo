package com.myoo.api.dao;

import java.util.List;

import com.myoo.api.domain.Record;

public interface RecordDao {
	
	Record get(String recordId);

	List<Record> all();

	List<Record> getByUserId(String userId);

	Record create(Record record);

	Record update(Record record);

	Record delete(String recordId);

	void deleteByAchievementId(String achievementId);
}
