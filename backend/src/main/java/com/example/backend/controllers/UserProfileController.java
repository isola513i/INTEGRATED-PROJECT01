package com.example.backend.controllers;

import com.example.backend.dtos.ProfileUpdateDto;
import com.example.backend.dtos.ProfileViewDto;
import com.example.backend.services.ProfileService;
import com.example.backend.utils.JwtTokenUtils;
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
    private JwtTokenUtils jwtTokenUtils;

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
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        String jwt = authorization.substring(7);

        // verify signature + expiration
        if (!jwtTokenUtils.isValidAuthToken(jwt)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        // read claims
        Jws<Claims> jwsClaims = jwtTokenUtils.parseAuth(jwt);
        Claims claims = jwsClaims.getBody();

        // must be access token only
        Object typ = claims.get("typ");
        if (typ == null || !"access".equals(typ.toString())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        Object idClaim = claims.get("id");
        if (idClaim == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }

        try {
            return Integer.valueOf(String.valueOf(idClaim)); // รองรับทั้ง String/Integer/Long
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token");
        }
    }
}
