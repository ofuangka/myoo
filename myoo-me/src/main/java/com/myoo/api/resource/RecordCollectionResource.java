package com.myoo.api.resource;

import java.util.List;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.ResourceContext;
import javax.ws.rs.core.Context;

import org.apache.commons.lang3.StringUtils;

import com.myoo.api.dao.RecordDao;
import com.myoo.api.domain.Record;

public class RecordCollectionResource {

	@Inject
	private RecordDao recordDao;

	@Context
	private ResourceContext context;

	@GET
	public List<Record> list(@QueryParam("uid") String userId) {
		if (StringUtils.isNotBlank(userId)) {
			return recordDao.getByUserId(userId);
		} else {
			return recordDao.all();
		}
	}

	@POST
	public Record create(@Valid Record record) {
		return recordDao.create(record);
	}

	@Path("/{recordId}")
	public RecordInstanceResource getRecordInstanceResource() {
		return context.getResource(RecordInstanceResource.class);
	}
}
