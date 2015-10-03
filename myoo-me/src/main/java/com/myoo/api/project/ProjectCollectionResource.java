package com.myoo.api.project;

import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang3.StringUtils;

import com.myoo.api.achievement.Achievement;
import com.myoo.api.achievement.AchievementService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class ProjectCollectionResource {

	@Inject
	private ProjectService projectService;

	@Inject
	private AchievementService achievementService;

	@Context
	private ResourceContext context;

	@GET
	public List<Project> query() {
		return projectService.query();
	}

	@POST
	public Project create(@Valid Project project) {
		List<Achievement> achievements = project.getAchievements();
		for (Achievement achievement : achievements) {
			achievement.setProjectId(project.getId());
			if (StringUtils.isNotBlank(achievement.getId())) {
				achievementService.update(achievement);
			} else {
				achievementService.create(achievement);
			}
		}
		return projectService.create(project);
	}

	@Path("/{projectId}")
	public ProjectInstanceResource getProjectInstanceResource() {
		return context.getResource(ProjectInstanceResource.class);
	}
}
