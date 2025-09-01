package com.example.backend.services;

import com.example.backend.dtos.JwtAuthResponse;
import com.example.backend.dtos.JwtRequestUser;
import com.example.backend.dtos.UserCreateRequestDto;
import com.example.backend.entities.User;
import com.example.backend.exceptions.ActivationRequiredException;
import com.example.backend.exceptions.AlreadyVerifiedException;
import com.example.backend.repositories.UserRepository;
import com.example.backend.utils.JwtTokenUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileStorage fileStorage;
    @Autowired JwtTokenUtils jwtTokenUtils;
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
            throw new ActivationRequiredException("You need to activate your accout before signing in.");
        }

        Map<String,Object> claims = new HashMap<>();
        claims.put("nickname", u.getNickName());
        claims.put("id", u.getId());
        claims.put("email", u.getEmail());
        claims.put("role", u.getUserType());

        String access  = jwtTokenUtils.generateAccessToken(claims);
        String refresh = jwtTokenUtils.generateRefreshToken(claims);

        return Map.of("access_token", access, "refresh_token", refresh);
    }

    public Map<String,String> refresh(String refreshToken) {
        if (!jwtTokenUtils.isValidAuthToken(refreshToken) || !jwtTokenUtils.isRefreshToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }
        var claims = jwtTokenUtils.parseAuth(refreshToken).getBody();
        String email = (String) claims.get("email");
        User u = userRepository.getUserByEmail(email);
        if (u == null) throw new BadCredentialsException("Invalid refresh token");
        if (Boolean.FALSE.equals(u.getIsActive()))
            throw new ActivationRequiredException("You need to activate your accout before signing in.");

        Map<String,Object> newClaims = Map.of(
                "nickname", u.getNickName(),
                "id", u.getId(),
                "email", u.getEmail(),
                "role", u.getUserType()
        );

        return Map.of(
                "access_token",  jwtTokenUtils.generateAccessToken(newClaims),
                "refresh_token", jwtTokenUtils.generateRefreshToken(newClaims)
        );
    }

}
