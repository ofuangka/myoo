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

import com.myoo.api.dao.ModifierDao;
import com.myoo.api.domain.Modifier;
import com.myoo.api.service.SecurityService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class ModifierCollectionResource {

	@Inject
	private ModifierDao modifierDao;

	@Inject
	private SecurityService userAccessService;

	@Context
	private ResourceContext context;

	@GET
	public List<Modifier> list(@QueryParam("pid") String projectId) {
		if (StringUtils.isNotBlank(projectId)) {
			return modifierDao.getByProjectId(projectId);
		} else {
			return modifierDao.all();
		}
	}

	@POST
	public Modifier create(@Valid Modifier modifier) {
		if (userAccessService.isUserAllowed(modifier.getProjectId())) {
			return modifierDao.create(modifier);
		} else {
			throw new SecurityException("User is not allowed to add Modifiers for that Project");
		}
	}

	@Path("{modifierId}")
	public ModifierInstanceResource getModifierInstanceResource() {
		return context.getResource(ModifierInstanceResource.class);
	}
}
