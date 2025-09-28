package com.example.backend.exceptions;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JsonAccessDeniedHandler implements org.springframework.security.web.access.AccessDeniedHandler {
    @Override
    public void handle(
            jakarta.servlet.http.HttpServletRequest request,
            jakarta.servlet.http.HttpServletResponse response,
            org.springframework.security.access.AccessDeniedException accessDeniedException
    ) throws IOException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().println(
                "{\"message\":\"Forbidden: missing SELLER authority\",\"status\":403," +
                        "\"path\":\"" + request.getRequestURI() + "\"}"
        );
        response.getWriter().flush();
    }
}
