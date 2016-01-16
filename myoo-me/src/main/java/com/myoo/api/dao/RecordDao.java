package com.myoo.api.dao;

import java.util.Date;
import java.util.List;

import com.myoo.api.domain.Record;

public interface RecordDao {

	Record get(String recordId);

	/**
	 * Gets all Records from beginDate to now
	 * 
	 * @return
	 */
	List<Record> all(Date beginDate);

	/**
	 * Gets Records for a given userId from beginDate to now
	 * 
	 * @param userId
	 * @param beginDate
	 * @return
	 */
	List<Record> getByUserId(String userId, Date beginDate);

	Record create(Record record);

	Record update(Record record);

	Record delete(String recordId);

	void deleteByAchievementId(String achievementId);
}
