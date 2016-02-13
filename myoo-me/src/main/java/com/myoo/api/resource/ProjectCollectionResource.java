package com.myoo.api.resource;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.myoo.api.dao.AchievementDao;
import com.myoo.api.dao.FootprintDao;
import com.myoo.api.dao.ProjectDao;
import com.myoo.api.domain.Achievement;
import com.myoo.api.domain.Footprint;
import com.myoo.api.domain.Project;
import com.myoo.api.service.SecurityService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class ProjectCollectionResource {

	@Inject
	private ProjectDao projectDao;

	@Inject
	private AchievementDao achievementDao;

	@Inject
	private SecurityService securityService;

	@Context
	private ResourceContext context;

	@Inject
	private FootprintDao footprintDao;

	@GET
	public List<Project> list(@QueryParam("own") boolean isOwn) {

		List<Project> ret = (isOwn) ? projectDao.getByUserId(securityService.getUserId()) : projectDao.all();

		/*
		 * for each project, determine the creator's username from their most
		 * recent footprint
		 */
		for (Project project : ret) {
			Footprint footprint = footprintDao.getFirstByUserId(project.getCreatedBy());
			if (footprint != null) {
				project.setCreatedByUsername(footprint.getUsername());
			}
		}

		return ret;

	}

	@POST
	public Project create(@NotNull @Valid Project project) {
		Date now = Calendar.getInstance().getTime();
		project.setCreatedBy(securityService.getUserId());
		project.setCreatedTs(now);
		project.setLastUpdatedTs(now);

		Project ret = projectDao.create(project);
		List<Achievement> achievements = project.getAchievements();
		if (achievements != null) {
			for (Achievement achievement : achievements) {
				achievement.setProjectId(ret.getId());
				achievementDao.create(achievement);
			}
		}
		ret.setCreatedByUsername(securityService.getUsername());
		return ret;
	}

	@Path("/{projectId}")
	public ProjectInstanceResource getProjectInstanceResource() {
		return context.getResource(ProjectInstanceResource.class);
	}
}
