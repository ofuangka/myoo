package com.myoo.api.service;

import java.util.List;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.codec.binary.StringUtils;
import org.apache.commons.codec.digest.Crypt;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.myoo.api.dao.ModifierDao;
import com.myoo.api.domain.Modifier;

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
	private ModifierDao modifierDao;

	private UserService userService = UserServiceFactory.getUserService();

	private String salt = DEFAULT_SALT;

	public String getUserId() {
		return Crypt.crypt(userService.getCurrentUser().getUserId(), salt);
	}

	@Override
	public boolean isUserAllowed(String projectId) {
		boolean ret = false;
		List<Modifier> allowedModifiers = modifierDao.getByProjectId(projectId);
		String userId = getUserId();
		for (Modifier modifier : allowedModifiers) {
			if (StringUtils.equals(userId, modifier.getUserId())) {
				ret = true;
				break;
			}
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
