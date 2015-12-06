package com.myoo.api.service;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.codec.digest.Crypt;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.myoo.api.support.GoogleSaltService;

@Named
public class GoogleUserIdService implements UserIdService {

	private UserService userService = UserServiceFactory.getUserService();

	@Inject
	private GoogleSaltService saltService;

	public String getUserId() {
		return Crypt.crypt(userService.getCurrentUser().getUserId(), saltService.getSalt());
	}

}
