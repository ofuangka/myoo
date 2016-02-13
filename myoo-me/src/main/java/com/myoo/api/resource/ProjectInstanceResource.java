package com.myoo.api.resource;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;

import com.myoo.api.dao.AchievementDao;
import com.myoo.api.dao.FootprintDao;
import com.myoo.api.dao.ProjectDao;
import com.myoo.api.dao.RecordDao;
import com.myoo.api.dao.SubscriptionDao;
import com.myoo.api.domain.Achievement;
import com.myoo.api.domain.Footprint;
import com.myoo.api.domain.Project;
import com.myoo.api.service.SecurityService;

@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class ProjectInstanceResource {

	@Inject
	private ProjectDao projectDao;

	@Inject
	private AchievementDao achievementDao;

	@Inject
	private SubscriptionDao subscriptionDao;

	@Inject
	private RecordDao recordDao;

	@Inject
	private SecurityService securityService;

	@Inject
	private FootprintDao footprintDao;

	@POST
	public Project update(@PathParam("projectId") String projectId, @Valid Project project) {

		// only authorized users are allowed to edit the project
		if (securityService.isUserAllowedToEditProject(projectId)) {
			List<Achievement> newAchievements = project.getAchievements();
			List<Achievement> currentAchievements = achievementDao.getByProjectId(projectId);

			// the list could contain a mixture of achievements to update (they
			// would already have an id), and achievements to create (those
			// without an id)
			if (newAchievements != null) {
				for (Achievement achievement : newAchievements) {
					String achievementId = achievement.getId();
					if (StringUtils.isNotBlank(achievementId)) {

						// make sure that the achievement is contained in the
						// set of achievements for this project
						if (achievementListContainsId(achievementId, currentAchievements)) {
							achievementDao.update(achievement);
						} else {
							// someone's trying to hack the system
							throw new SecurityException("User is not allowed to update that Achievement");
						}
					} else {
						achievement.setProjectId(projectId);
						achievementDao.create(achievement);
					}
				}
			}

			// delete any achievements that are not in the user's list
			if (currentAchievements != null) {
				for (Achievement achievement : currentAchievements) {
					String achievementId = achievement.getId();
					if (!achievementListContainsId(achievementId, newAchievements)) {
						achievementDao.delete(achievementId);
					}
				}
			}

			// now update the actual project information
			Project original = projectDao.get(projectId);
			Date now = Calendar.getInstance().getTime();
			project.setId(projectId);
			project.setLastUpdatedTs(now);
			project.setCreatedTs(original.getCreatedTs());

			/* determine the username of the project creator */
			String createdBy = original.getCreatedBy();
			Footprint creatorFootprint = footprintDao.getFirstByUserId(createdBy);
			if (creatorFootprint != null) {
				project.setCreatedByUsername(creatorFootprint.getUsername());
			}
			project.setCreatedBy(createdBy);
			return projectDao.update(project);
		} else {
			throw new SecurityException("User is not allowed to update that Project");
		}
	}

	private boolean achievementListContainsId(String achievementId, List<Achievement> achievementList) {
		boolean ret = false;
		if (achievementList != null) {
			for (Achievement achievement : achievementList) {
				if (StringUtils.equals(achievementId, achievement.getId())) {
					ret = true;
					break;
				}
			}
		}
		return ret;
	}

	@DELETE
	public Project delete(@PathParam("projectId") String projectId) {
		if (securityService.isUserAllowedToEditProject(projectId)) {
			Project ret = projectDao.delete(projectId);
			List<Achievement> achievements = achievementDao.getByProjectId(projectId);
			if (achievements != null) {
				for (Achievement achievement : achievements) {
					recordDao.deleteByAchievementId(achievement.getId());
				}
			}
			achievementDao.deleteByProjectId(projectId);
			subscriptionDao.deleteByProjectId(projectId);
			return ret;
		} else {
			throw new SecurityException("User is not allowed to delete that Project");
		}
	}

}
