package com.myoo.api.resource;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PathParam;

import com.myoo.api.dao.RecordDao;
import com.myoo.api.domain.Record;

public class RecordInstanceResource {

	@Inject
	private RecordDao recordDao;

	@GET
	public Record read(@PathParam("recordId") String recordId) {
		return recordDao.get(recordId);
	}

	@POST
	public Record update(@PathParam("recordId") String recordId, @Valid Record record) {
		record.setId(recordId);
		return recordDao.update(record);
	}

	@DELETE
	public Record delete(@PathParam("recordId") String recordId) {
		return recordDao.delete(recordId);
	}
}
