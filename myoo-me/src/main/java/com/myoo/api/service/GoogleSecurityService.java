package com.myoo.api.service;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.codec.digest.Crypt;
import org.apache.commons.lang3.StringUtils;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.myoo.api.dao.ProjectDao;
import com.myoo.api.domain.Project;

@Named
public class GoogleSecurityService implements SecurityService {

	private static final String DEFAULT_SALT = "mysecretkey";
	private static final String KIND_SALT = "Salt";
	private static final String KEY_VALUE = "value";

	public GoogleSecurityService() {
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Query query = new Query(KIND_SALT);
		Entity entity = datastore.prepare(query).asSingleEntity();
		if (entity != null) {
			salt = (String) entity.getProperty(KEY_VALUE);
		}
	}

	@Inject
	private ProjectDao projectDao;

	private UserService userService = UserServiceFactory.getUserService();

	private String salt = DEFAULT_SALT;

	public String getUserId() {
		return Crypt.crypt(userService.getCurrentUser().getUserId(), salt);
	}

	@Override
	public boolean isUserAllowedToEditProject(String projectId) {
		boolean ret = false;
		String userId = getUserId();
		Project project = projectDao.get(projectId);
		if (StringUtils.equals(userId, project.getCreatedBy())) {
			ret = true;
		}
		return ret;
	}

	@Override
	public boolean isSelf(String userId) {
		return StringUtils.equals(userId, getUserId());
	}

	@Override
	public String getLogoutUrl(String afterUrl) {
		return userService.createLogoutURL(afterUrl);
	}

	@Override
	public String getUsername() {
		return userService.getCurrentUser().getNickname();
	}

}
