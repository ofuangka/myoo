package com.myoo.api.service;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.myoo.api.dao.AchievementDao;
import com.myoo.api.dao.ProjectDao;
import com.myoo.api.dao.SubscriptionDao;
import com.myoo.api.domain.Achievement;
import com.myoo.api.domain.Project;
import com.myoo.api.domain.Subscription;

@Named
public class GoogleCreateProjectService implements CreateProjectService {

	@Inject
	ProjectDao projectDao;

	@Inject
	AchievementDao achievementDao;

	@Inject
	SubscriptionDao subscriptionDao;

	UserService userService = UserServiceFactory.getUserService();

	@Override
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
		subscription.setUserId(userService.getCurrentUser().getUserId());
		subscriptionDao.create(subscription);
		return ret;
	}

}
