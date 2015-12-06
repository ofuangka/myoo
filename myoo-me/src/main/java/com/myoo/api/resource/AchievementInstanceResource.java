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

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class AchievementInstanceResource {

	@Inject
	private AchievementDao achievementDao;

	@GET
	public Achievement read(@PathParam("achievementId") String achievementId) {
		return achievementDao.get(achievementId);
	}

	@POST
	public Achievement update(@PathParam("achievementId") String achievementId, @Valid Achievement achievement) {
		achievement.setId(achievementId);
		return achievementDao.update(achievement);
	}

	@DELETE
	public Achievement delete(@PathParam("achievementId") String achievementId) {
		return achievementDao.delete(achievementId);
	}

}
