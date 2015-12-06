package com.myoo.api.provider;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class SecurityExceptionHandler implements ExceptionMapper<SecurityException> {

	@Override
	public Response toResponse(SecurityException arg0) {
		return Response.status(403).build();
	}

}
