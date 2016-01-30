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

import com.myoo.api.dao.ModifierDao;
import com.myoo.api.domain.Modifier;
import com.myoo.api.service.SecurityService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class ModifierInstanceResource {

	@Inject
	private ModifierDao modifierDao;

	@Inject
	private SecurityService userAccessService;

	@GET
	public Modifier read(@PathParam("modifierId") String modifierId) {
		return modifierDao.get(modifierId);
	}

	@POST
	public Modifier update(@PathParam("modifierId") String modifierId, @Valid Modifier modifier) {
		if (userAccessService.isUserAllowedToEditProject(modifierDao.get(modifierId).getProjectId())) {
			modifier.setId(modifierId);
			return modifierDao.update(modifier);
		} else {
			throw new SecurityException("User is not allowed to update Modifiers for that Project");
		}
	}

	@DELETE
	public Modifier delete(@PathParam("modifierId") String modifierId) {
		if (userAccessService.isUserAllowedToEditProject(modifierDao.get(modifierId).getProjectId())) {
			return modifierDao.delete(modifierId);
		} else {
			throw new SecurityException("User is not allowed to delete Modifiers for that Project");
		}
	}
}
