package com.myoo.api.dao;

import java.util.List;

import com.myoo.api.domain.Achievement;

public interface AchievementDao {

	Achievement get(String achievementId);

	List<Achievement> all();

	/**
	 * Fetches all Achievements related to the given projectId
	 * 
	 * @param projectId
	 * @return
	 */
	List<Achievement> getByProjectId(String projectId);

	/**
	 * Creates a new Achievement and returns it. Returns null if something went
	 * wrong
	 * 
	 * @param achievement
	 * @return
	 */
	Achievement create(Achievement achievement);

	/**
	 * Updates the given Achievement and returns it. Returns null if something
	 * went wrong
	 * 
	 * @param achievement
	 * @return
	 */
	Achievement update(Achievement achievement);

	Achievement delete(String achievementId);

	void deleteByProjectId(String projectId);
}
