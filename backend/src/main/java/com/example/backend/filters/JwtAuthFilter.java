package com.example.backend.filters;

import com.example.backend.services.JwtUserDetailsService;
import com.example.backend.utils.JwtTokenUtils;
import com.example.backend.utils.JwtUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private JwtUserDetailsService jwtUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        final JWTClaimsSet claims;
        try {
            claims = jwtUtils.parseAuth(token); // verifies RSA signature
        } catch (Exception e) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid JWT token");
            return;
        }

        // (1) exp check (Nimbus doesn't do this automatically)
        Date exp = claims.getExpirationTime();
        if (exp == null || exp.before(new Date())) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "JWT token has expired");
            return;
        }

        // (2) optional: enforce token type = access
        Object typ = claims.getClaim("typ");
        if (typ != null && !"access".equals(String.valueOf(typ))) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid token type");
            return;
        }

        // (3) username and id from claims
        String username = claims.getSubject();                  // preferred
        if (username == null) {
            try {
                username = claims.getStringClaim("email"); // fallback if you store email in claim
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }

        Object idObj = claims.getClaim("id");                   // your new tokens use "id"
        if (idObj == null) idObj = claims.getClaim("uid");      // fallback for older tokens
        Integer userId = null;
        if (idObj instanceof Number n) userId = n.intValue();
        else if (idObj instanceof String s) {
            try { userId = Integer.valueOf(s); } catch (NumberFormatException ignored) {}
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails =
                    (userId != null)
                            ? jwtUserDetailsService.loadUserById(userId)
                            : jwtUserDetailsService.loadUserByUsername(username);

            if (userDetails == null || !username.equals(userDetails.getUsername())) {
                response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid JWT token (user mismatch)");
                return;
            }

            var authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        chain.doFilter(request, response);
    }
}