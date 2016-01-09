package com.myoo.api.service;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import com.myoo.api.dao.AchievementDao;
import com.myoo.api.dao.ProjectDao;
import com.myoo.api.domain.Achievement;
import com.myoo.api.domain.Project;

@Named
public class ProjectService {

	@Inject
	private ProjectDao projectDao;

	@Inject
	private AchievementDao achievementDao;

	/**
	 * Creates a {@link Project} and creates the {@link Achievement}s
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
		return ret;
	}
}
