package com.example.backend.services;

import com.example.backend.dtos.ChangePasswordRequestDto;
import com.example.backend.dtos.JwtRequestUser;
import com.example.backend.dtos.ResetPasswordRequestDto;
import com.example.backend.dtos.UserCreateRequestDto;
import com.example.backend.entities.User;
import com.example.backend.exceptions.ActivationRequiredException;
import com.example.backend.exceptions.AlreadyVerifiedException;
import com.example.backend.repositories.UserRepository;
import com.example.backend.utils.JwtTokenUtils;
import com.example.backend.utils.JwtUtils;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileStorage fileStorage;
    @Autowired
    private JwtTokenUtils jwtTokenUtils;
    @Autowired
    private JwtUtils jwtUtils;
    private Argon2PasswordEncoder passwordEncoder = new Argon2PasswordEncoder(16, 16, 8, 1024*128, 2);

    private String trim(String s) {
        return s == null ? null : s.trim();
    }

    public User registerUsers(UserCreateRequestDto requestUser) throws IOException {
        User isExistingUser = userRepository.getUserByEmail(requestUser.getEmail());
        if (isExistingUser != null) { // if this email has been use for register.
            if (isExistingUser.getIsActive()) { // check is this verify
                throw new IllegalArgumentException("Email already exists and verified.");
            } else { // if not verify , generate new token to verify again.
                String token = JwtTokenUtils.generateToken(requestUser.getEmail());
                isExistingUser.setLatestVerifyToken(token);
                return userRepository.save(isExistingUser);
            }
        } else {
            String userType = (requestUser.getUserType()).toUpperCase();
            User user = new User();
            String token = JwtTokenUtils.generateToken(requestUser.getEmail());

            user.setNickName(trim(requestUser.getNickName()));
            user.setEmail(trim(requestUser.getEmail()));
            user.setFullName(trim(requestUser.getFullName()));
            user.setPasswordHash(passwordEncoder.encode(requestUser.getPassword()));
            user.setUserType(userType);
            user.setIsActive(false);
            user.setLatestVerifyToken(token);

            if ("SELLER".equals(userType)) {
                user.setPhoneNumber((requestUser.getPhoneNumber()));
                user.setBankAccount((requestUser.getBankAccount()));
                user.setBankName((requestUser.getBankName()));
                user.setIdCardNumber((requestUser.getIdCardNumber()));
            }
            User savedUser = userRepository.save(user);

            if (requestUser.getIdCardImageFront() != null && !requestUser.getIdCardImageFront().isEmpty() && requestUser.getIdCardImageBack() != null && !requestUser.getIdCardImageBack().isEmpty()) {
                var f = fileStorage.storeUserIdCardFile(savedUser.getId(), requestUser.getIdCardImageFront(), "front");
                var b = fileStorage.storeUserIdCardFile(savedUser.getId(), requestUser.getIdCardImageBack(), "back");
                savedUser.setIdCardImageFront(f.getPath());
                savedUser.setIdCardImageBack(b.getPath());
                return userRepository.save(savedUser);
            }
            return savedUser;
        }
    }

    public User getUserByEmail(String email){
        return userRepository.getUserByEmail(email);
    }

    public User verifyUserByEmail(String token){
        String emailString = jwtTokenUtils.extractEmail(token);
        User user = getUserByEmail(emailString);
        if(user == null || user.getLatestVerifyToken() == null || !jwtTokenUtils.validateToken(token)|| !user.getLatestVerifyToken().equals(token)){
            throw new IllegalArgumentException("Invalid verification token");
        }
        if(user.getIsActive() == true){
            throw new AlreadyVerifiedException("Email already verified");
        }
        user.setIsActive(true);
        return userRepository.save(user);
    }

    public Map<String, String> authenticate(JwtRequestUser req) {
        User u = userRepository.getUserByEmail(req.getEmail());
        if (u == null || !passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new BadCredentialsException("Username or Password is incorrect");
        }
        if (Boolean.FALSE.equals(u.getIsActive())) {
            throw new ActivationRequiredException("You need to activate your account before signing in.");
        }

        Map<String,Object> claims = new HashMap<>();
        claims.put("nickname", u.getNickName());
        claims.put("id", u.getId());
        claims.put("email", u.getEmail());
        claims.put("role", u.getUserType());

        String access  = jwtUtils.generateAccessToken(claims);
        String refresh = jwtUtils.generateRefreshToken(claims);

        return Map.of("access_token", access, "refresh_token", refresh);
    }

    public Map<String, String> refresh(String refreshToken) throws ParseException {
        // 1) Verify signature/expiry and that this is a refresh token
        if (!jwtUtils.isValidRefreshToken(refreshToken) || !jwtUtils.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        // 2) Parse claims (RSA verified inside parseAuth)
        JWTClaimsSet claims = jwtUtils.parseAuth(refreshToken);

        // If you store email in a custom claim "email" (as you do in newClaims):
        String email = claims.getStringClaim("email");
        // If instead you stored it as subject, use: String email = claims.getSubject();

        if (email == null || email.isBlank()) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        // 3) Load user and validate status
        User u = userRepository.getUserByEmail(email);
        if (u == null) {
            throw new BadCredentialsException("Invalid refresh token");
        }
        if (Boolean.FALSE.equals(u.getIsActive())) {
            throw new ActivationRequiredException("You need to activate your account before signing in.");
        }

        // 4) Build fresh claims for new tokens
        Map<String, Object> newClaims = Map.of(
                "nickname", u.getNickName(),
                "id",       u.getId(),
                "email",    u.getEmail(),
                "role",     String.valueOf(u.getUserType())
        );

        // 5) Issue new tokens
        return Map.of(
                "access_token",  jwtUtils.generateAccessToken(newClaims),
                "refresh_token", jwtUtils.generateRefreshToken(newClaims)
        );
    }

    public void changePassword(Integer userId, ChangePasswordRequestDto changePasswordRequestDto, HttpServletRequest request) {
        User user = getUserById(userId);
        if(user.getPasswordHash() == null || !passwordEncoder.matches(changePasswordRequestDto.getOldPassword(), user.getPasswordHash())){
            throw new IllegalArgumentException("Current password is incorrect.");
        }
        if(!changePasswordRequestDto.getNewPassword().equals(changePasswordRequestDto.getConfirmNewPassword())){
            throw new IllegalArgumentException("New password and confirm new password do not match.");
        }
        user.setPasswordHash(passwordEncoder.encode(changePasswordRequestDto.getNewPassword()));
        userRepository.save(user);
    }
    public void resetPassword(String token, ResetPasswordRequestDto resetPasswordRequestDto){
        if(!jwtTokenUtils.validateToken(token)){
            throw new IllegalArgumentException("Invalid or expired reset token.");
        }
        String emailString = jwtTokenUtils.extractEmail(token);
        if(emailString == null || emailString.isBlank()){
            throw new IllegalArgumentException("Invalid reset token.");
        }
        User user = getUserByEmail(emailString);
        // check user is exits
        // implement reset password logic - check new password = confirm new password , encode new password and set new value use setter then save to db
        if(user == null){
            throw new IllegalArgumentException("User not found for the provided reset token.");
        }
        if(!resetPasswordRequestDto.getNewPassword().equals(resetPasswordRequestDto.getConfirmNewPassword())){
            throw new IllegalArgumentException("New password and confirm new password do not match.");
        }
        user.setPasswordHash(passwordEncoder.encode(resetPasswordRequestDto.getNewPassword()));
        userRepository.save(user);
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

}
