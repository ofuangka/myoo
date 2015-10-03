package com.myoo.api.achievement;

import java.util.List;

public interface AchievementService {

	/**
	 * Fetches all Achievements related to the given projectId
	 * 
	 * @param projectId
	 * @return
	 */
	List<Achievement> query(String projectId);

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
}
