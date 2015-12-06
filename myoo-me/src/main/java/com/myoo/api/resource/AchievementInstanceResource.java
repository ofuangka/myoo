package com.myoo.api.resource;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.myoo.api.dao.AchievementDao;
import com.myoo.api.domain.Achievement;
import com.myoo.api.service.SecurityService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class AchievementInstanceResource {

	@Inject
	private AchievementDao achievementDao;

	@Inject
	private SecurityService userAccessService;

	@GET
	public Achievement read(@PathParam("achievementId") String achievementId) {
		return achievementDao.get(achievementId);
	}

	@POST
	public Achievement update(@PathParam("achievementId") String achievementId, @Valid Achievement achievement) {
		if (userAccessService.isUserAllowed(achievementDao.get(achievementId).getProjectId())) {
			achievement.setId(achievementId);
			return achievementDao.update(achievement);
		} else {
			throw new SecurityException("User is not allowed to modify Achievements for that Project");
		}
	}

	@DELETE
	public Achievement delete(@PathParam("achievementId") String achievementId) {
		if (userAccessService.isUserAllowed(achievementDao.get(achievementId).getProjectId())) {
			return achievementDao.delete(achievementId);
		} else {
			throw new SecurityException("User is not allowed to delete Achievements for that Project");
		}
	}

}
