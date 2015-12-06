package com.myoo.api.resource;

import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;

import com.myoo.api.achievement.AchievementDao;
import com.myoo.api.domain.Achievement;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class AchievementCollectionResource {

	@Inject
	private AchievementDao achievementDao;

	@Context
	private ResourceContext context;

	@GET
	public List<Achievement> list(@QueryParam("pid") String projectId) {
		if (StringUtils.isNotBlank(projectId)) {
			return achievementDao.getByProjectId(projectId);
		} else {
			return achievementDao.all();
		}
	}

	@POST
	public Achievement create(@Valid Achievement achievement) {
		return achievementDao.create(achievement);
	}

	@Path("/{achievementId}")
	public AchievementInstanceResource getAchievementInstanceResource() {
		return context.getResource(AchievementInstanceResource.class);
	}
}
