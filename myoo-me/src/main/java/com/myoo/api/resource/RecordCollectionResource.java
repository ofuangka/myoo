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

import com.myoo.api.dao.RecordDao;
import com.myoo.api.domain.Record;
import com.myoo.api.service.SecurityService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class RecordCollectionResource {

	@Inject
	private RecordDao recordDao;

	@Inject
	private SecurityService securityService;

	@Context
	private ResourceContext context;

	@GET
	public List<Record> list(@QueryParam("own") boolean isOwn) {
		if (isOwn) {
			return recordDao.getByUserId(securityService.getUserId());
		} else {
			return recordDao.all();
		}
	}

	@POST
	public Record create(@NotNull @Valid Record record) {
		Date now = Calendar.getInstance().getTime();
		record.setUserId(securityService.getUserId());
		record.setTs(now);
		return recordDao.create(record);
	}

	@Path("/{recordId}")
	public RecordInstanceResource getRecordInstanceResource() {
		return context.getResource(RecordInstanceResource.class);
	}
}
