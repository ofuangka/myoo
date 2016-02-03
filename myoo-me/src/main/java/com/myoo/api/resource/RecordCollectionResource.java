package com.myoo.api.resource;

import java.text.ParseException;
import java.util.ArrayList;
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

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.hibernate.validator.constraints.NotBlank;

import com.myoo.api.dao.AchievementDao;
import com.myoo.api.dao.RecordDao;
import com.myoo.api.domain.Achievement;
import com.myoo.api.domain.Record;
import com.myoo.api.service.SecurityService;

@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class RecordCollectionResource {

	private static final String EXPECTED_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.sssZ";

	@Inject
	private AchievementDao achievementDao;

	@Inject
	private RecordDao recordDao;

	@Inject
	private SecurityService securityService;

	@Context
	private ResourceContext context;

	@GET
	public List<Record> list(@QueryParam("own") boolean isOwn, @QueryParam("pid") String projectId,
			@NotNull @NotBlank @QueryParam("begin_date") String beginDateString,
			@NotNull @NotBlank @QueryParam("end_date") String endDateString) {
		try {
			Date beginDate = DateUtils.parseDate(beginDateString, EXPECTED_DATE_FORMAT);
			Date endDate = DateUtils.addDays(DateUtils.parseDate(endDateString, EXPECTED_DATE_FORMAT), 1);
			if (isOwn) {
				if (StringUtils.isNotBlank(projectId)) {
					List<Record> ret = new ArrayList<Record>();
					List<Achievement> achievements = achievementDao.getByProjectId(projectId);
					for (Achievement achievement : achievements) {
						ret.addAll(recordDao.getByUserIdByAchievementId(securityService.getUserId(),
								achievement.getId(), beginDate, endDate));
					}
					return ret;
				}
				return recordDao.getByUserId(securityService.getUserId(), beginDate, endDate);
			} else {
				if (StringUtils.isNotBlank(projectId)) {
					List<Record> ret = new ArrayList<Record>();
					List<Achievement> achievements = achievementDao.getByProjectId(projectId);
					for (Achievement achievement : achievements) {
						ret.addAll(recordDao.getByAchievementId(achievement.getId(), beginDate, endDate));
					}
					return ret;
				} else {
					return recordDao.all(beginDate, endDate);
				}
			}
		} catch (ParseException e) {
			throw new IllegalArgumentException(e);
		}
	}

	@POST
	public Record create(@NotNull @Valid Record record) {
		Date now = Calendar.getInstance().getTime();
		record.setUserId(securityService.getUserId());
		record.setUsername(securityService.getUsername());
		record.setTs(now);
		return recordDao.create(record);
	}

	@Path("/{recordId}")
	public RecordInstanceResource getRecordInstanceResource() {
		return context.getResource(RecordInstanceResource.class);
	}
}
