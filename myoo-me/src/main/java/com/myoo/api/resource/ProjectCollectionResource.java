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
import com.myoo.api.dao.ProjectDao;
import com.myoo.api.domain.Achievement;
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

	@GET
	public List<Project> list(@QueryParam("own") boolean isOwn) {
		if (isOwn) {
			return projectDao.getByUserId(securityService.getUserId());
		} else {
			return projectDao.all();
		}
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
		return ret;
	}

	@Path("/{projectId}")
	public ProjectInstanceResource getProjectInstanceResource() {
		return context.getResource(ProjectInstanceResource.class);
	}
}
