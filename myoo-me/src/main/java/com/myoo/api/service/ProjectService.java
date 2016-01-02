package com.myoo.api.service;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import com.myoo.api.dao.AchievementDao;
import com.myoo.api.dao.ProjectDao;
import com.myoo.api.dao.SubscriptionDao;
import com.myoo.api.domain.Achievement;
import com.myoo.api.domain.Project;
import com.myoo.api.domain.Subscription;

@Named
public class ProjectService {

	@Inject
	private ProjectDao projectDao;

	@Inject
	private AchievementDao achievementDao;

	@Inject
	private SubscriptionDao subscriptionDao;

	@Inject
	private SecurityService securityService;

	/**
	 * Creates a {@link Project}, creates the {@link Achievement}s, then creates
	 * a {@link Subscription} for the current user
	 * 
	 * @param project
	 * @return
	 */
	public Project createProject(Project project) {

		Project ret = projectDao.create(project);
		List<Achievement> achievements = project.getAchievements();
		if (achievements != null) {
			for (Achievement achievement : achievements) {
				achievement.setProjectId(ret.getId());
				achievementDao.create(achievement);
			}
		}
		Subscription subscription = new Subscription();
		subscription.setProjectId(ret.getId());
		subscription.setUserId(securityService.getUserId());
		subscriptionDao.create(subscription);
		return ret;
	}
}
