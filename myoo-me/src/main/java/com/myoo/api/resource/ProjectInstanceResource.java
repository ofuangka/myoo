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

import com.myoo.api.achievement.AchievementDao;
import com.myoo.api.domain.Project;
import com.myoo.api.project.ProjectDao;
import com.myoo.api.subscription.SubscriptionDao;

@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class ProjectInstanceResource {

	@Inject
	private ProjectDao projectDao;

	@Inject
	private AchievementDao achievementDao;

	@Inject
	private SubscriptionDao subscriptionDao;

	@GET
	public Project read(@PathParam("projectId") String projectId) {
		return projectDao.get(projectId);
	}

	@POST
	public Project update(@PathParam("projectId") String projectId, @Valid Project project) {
		project.setId(projectId);
		return projectDao.update(project);
	}

	@DELETE
	public Project delete(@PathParam("projectId") String projectId) {
		Project ret = projectDao.delete(projectId);
		achievementDao.deleteByProjectId(projectId);
		subscriptionDao.deleteByProjectId(projectId);
		return ret;
	}

}
