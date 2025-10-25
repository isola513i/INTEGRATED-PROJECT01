package com.example.backend.controllers;

import com.example.backend.dtos.*;

import com.example.backend.entities.User;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.exceptions.SellerNotMatchInTokenException;
import com.example.backend.services.EmailService;
import com.example.backend.services.UserService;
import com.example.backend.utils.JwtUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.Duration;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/itb-mshop")
//@CrossOrigin("*")
@CrossOrigin(origins = "http://localhost:5173",allowCredentials = "true")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private EmailService emailService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping(value = "/v2/auth/register", consumes = {"multipart/form-data"})
    public ResponseEntity<UserCreateResponseDto> registerUsers(@Valid @ModelAttribute UserCreateRequestDto request)
            throws Exception {
        User savedUser = userService.registerUsers(request);
        if(savedUser != null){
            emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getLatestVerifyToken());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(modelMapper.map(savedUser, UserCreateResponseDto.class));
    }

    @PostMapping("/v2/auth/verify-email")
    public ResponseEntity<UserCreateResponseDto> verifyByEmail(@RequestParam("token") String token){
        return ResponseEntity.ok(modelMapper.map(userService.verifyUserByEmail(token),UserCreateResponseDto.class));
    }

    @PostMapping("/v2/auth/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody JwtRequestUser body){
        Map<String, String> tokens = userService.authenticate(body);           // returns access & refresh
        String accessToken  = tokens.get("access_token");
        String refreshToken = tokens.get("refresh_token");

        ResponseCookie cookie = buildRefreshCookie(refreshToken);

        // return only access token in body; put refresh token in HttpOnly cookie
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("access_token", accessToken));
    }

    @PostMapping("/v2/auth/refresh")
    public ResponseEntity<Map<String, String>> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshCookie,
            @RequestBody(required = false) Map<String, String> body
    ) throws java.text.ParseException {
        // Prefer cookie; fallback to JSON for flexibility or tools like cURL
        String provided = refreshCookie;
        if ((provided == null || provided.isBlank()) && body != null) {
            provided = body.getOrDefault("refresh_token", body.get("refreshToken"));
        }
//        if (provided == null || provided.isBlank()) {
//            throw new IllegalArgumentException("refresh_token is required (cookie or body)");
//        }
        Map<String, String> newTokens = userService.refresh(provided); // rotates refresh + new access
        String newAccess  = newTokens.get("access_token");
        String newRefresh = newTokens.get("refresh_token");

        ResponseCookie cookie = buildRefreshCookie(newRefresh);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("access_token", newAccess));
    }

    @PostMapping("/v2/auth/{userId}/change-password")
    public ResponseEntity<Boolean> changePassword(@PathVariable Integer userId,
                                                  @RequestBody @Valid ChangePasswordRequestDto changePasswordRequestDto,
                                                  HttpServletRequest request) {
        Integer userIdInToken =  jwtUtils.extractUserId(request);
        User user = userService.getUserById(userId);
        if (userIdInToken == null || !userIdInToken.equals(userId) || !user.getIsActive()) {
            throw new SellerNotMatchInTokenException("User does not match the user in token or user is not active.");
        }
        userService.changePassword(userId, changePasswordRequestDto, request);
        return ResponseEntity.ok(true);
    }
    @PostMapping("/v2/auth/forget-password")
    public ResponseEntity<Boolean> forgetPassword(@RequestParam("email") String email) {
        User user = userService.getUserByEmail(email);
        if(user != null && user.getIsActive()) {
            emailService.sendResetPasswordEmail(user.getEmail(), email);
        } else throw new ItemNotFoundException("User with the provided email does not exist or is not active.");
        return ResponseEntity.ok(true);
    }
    @PostMapping("/v2/auth/reset-password")
    public ResponseEntity<Boolean> resetPassword(@RequestParam("token") String token,
                                                 @RequestBody @Valid ResetPasswordRequestDto resetPasswordRequestDto) {
        userService.resetPassword(token, resetPasswordRequestDto);
        return ResponseEntity.ok(true);
    }


    // inject refresh lifetime to align cookie expiry with JWT expiry
    @Value("${jwt.refresh.hours}")
    private long refreshHours;

    // choose cookie attributes suitable for your environment
//    @Value("${app.cookies.secure:true}")   // true in HTTPS; set to false for plain HTTP in local dev
//    private boolean cookieSecure;

    @Value("${app.cookies.secure:false}")   // true in HTTPS; set to false for plain HTTP in local dev
    private boolean cookieSecure;


    //    @Value("${app.cookies.same-site:Strict}") // None|Lax|Strict (None required for cross-site)
//    private String cookieSameSite;
@Value("${app.cookies.same-site:Lax}") // None|Lax|Strict (None required for cross-site)
private String cookieSameSite;

    // Path that should send the cookie ("/" is simplest if multiple endpoints need it)
    @Value("${app.cookies.refresh.path:/itb-mshop/v2/auth")
    private String refreshCookiePath;

    private ResponseCookie buildRefreshCookie(String token) {
        return ResponseCookie.from("refresh_token", token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path(refreshCookiePath)
                .sameSite(cookieSameSite)                // Spring 6 supports this directly
                .maxAge(Duration.ofHours(refreshHours))  // align with JWT refresh lifetime
                .build();
    }
    @PostMapping("/v2/auth/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) throws ParseException {

        // 400: no access token / not a Bearer token
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        final String token = authHeader.substring(7).trim();
        final JWTClaimsSet claims;
        try {
            // verifies RSA signature via JwtUtils (throws on invalid)
            claims = jwtUtils.parseAuth(token);
        } catch (Exception e) {
            // 400: invalid token (bad signature / malformed)
            return ResponseEntity.badRequest().build();
        }

        // 400: expired or wrong type (must be "access")
        Date exp = claims.getExpirationTime();
        if (exp == null || exp.before(new Date())) {
            return ResponseEntity.badRequest().build();
        }
        Object typ = claims.getClaim("typ");
        if (typ == null || !"access".equals(String.valueOf(typ))) {
            return ResponseEntity.badRequest().build();
        }

        // pull identity (subject preferred; fallback to "email" claim)
        String email = claims.getSubject();
        if (email == null || email.isBlank()) {
            email = claims.getStringClaim("email");
        }
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // 401: user not found
        User u = userService.getUserByEmail(email);
        if (u == null) {
            return ResponseEntity.status(401).build();
        }

        // 403: user inactive
        if (Boolean.FALSE.equals(u.getIsActive())) {
            return ResponseEntity.status(403).build();
        }

        // 204 + clear HttpOnly refresh cookie
        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString())
                .build();
    }
    private ResponseCookie clearRefreshCookie() {
        return ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path(refreshCookiePath)
                .sameSite(cookieSameSite)
                .maxAge(0) // Set maxAge to 0 to clear the cookie
                .build();
    }

}
