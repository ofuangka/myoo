package com.myoo.api.dao;

import java.util.Date;
import java.util.List;

import com.myoo.api.domain.Record;

public interface RecordDao {

	Record get(String recordId);

	/**
	 * Gets all Records from beginDate to endDate
	 * 
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	List<Record> all(Date beginDate, Date endDate);

	/**
	 * Gets Records for a given userId from beginDate to endDate
	 * 
	 * @param userId
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	List<Record> getByUserId(String userId, Date beginDate, Date endDate);

	/**
	 * Gets Records for a given userId and achievementId from beginDate to
	 * endDate
	 * 
	 * @param userId
	 * @param achievementId
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	List<Record> getByUserIdByAchievementId(String userId, String achievementId, Date beginDate, Date endDate);

	/**
	 * Gets Records for a given achievementId from beginDate to endDate
	 * 
	 * @param achievementId
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	List<Record> getByAchievementId(String achievementId, Date beginDate, Date endDate);

	Record create(Record record);

	Record update(Record record);

	Record delete(String recordId);

	void deleteByAchievementId(String achievementId);
}
