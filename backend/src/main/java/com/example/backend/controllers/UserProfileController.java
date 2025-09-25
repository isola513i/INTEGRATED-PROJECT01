package com.example.backend.controllers;

import com.example.backend.dtos.ProfileUpdateDto;
import com.example.backend.dtos.ProfileViewDto;
import com.example.backend.services.ProfileService;
import com.example.backend.utils.JwtTokenUtils;
import com.example.backend.utils.JwtUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(value = "/itb-mshop", produces = { "application/hal+json" })
@CrossOrigin("*")
public class UserProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JwtUtils jwtUtils;

    // GET /v2/users/{id}
    @GetMapping("/v2/users/{id}")
    public ResponseEntity<ProfileViewDto> getProfile(@PathVariable("id") Integer requestedUserId,
                                                     HttpServletRequest httpRequest) {
        Integer authenticatedUserId = extractUserIdFromAccessToken(httpRequest);
        ProfileViewDto profile = profileService.getProfile(requestedUserId, authenticatedUserId);
        return ResponseEntity.ok(profile);
    }

    // PUT /v2/users/{id}
    @PutMapping(value = "/v2/users/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProfileViewDto> updateProfile(@PathVariable("id") Integer requestedUserId,
                                                        @RequestBody ProfileUpdateDto updateRequest,
                                                        HttpServletRequest httpRequest) {
        Integer authenticatedUserId = extractUserIdFromAccessToken(httpRequest);
        ProfileViewDto updated = profileService.updateProfile(requestedUserId, authenticatedUserId, updateRequest);
        return ResponseEntity.ok(updated);
    }

    // Extracts and validates the authenticated user's ID from the Authorization header.
    private Integer extractUserIdFromAccessToken(HttpServletRequest request) {
        // 1) read "Bearer <token>"
        String token = jwtUtils.resolveToken(request);
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        // 2) verify signature + parse claims (Nimbus)
        var claims = jwtUtils.parseAuth(token);

        // 3) expiration check (Nimbus doesn't do it for you)
        var exp = claims.getExpirationTime();
        if (exp == null || exp.before(new java.util.Date())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        // 4) must be access token
        Object typ = claims.getClaim("typ");
        if (!"access".equals(String.valueOf(typ))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        // 5) extract user id using your util (checks sub/id/uid)
        try {
            return jwtUtils.extractUserId(token);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }
    }
}
