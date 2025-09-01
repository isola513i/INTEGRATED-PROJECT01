package com.example.backend.services;

import com.example.backend.dtos.JwtRequestUser;
import com.example.backend.dtos.UserCreateRequestDto;
import com.example.backend.dtos.UserCreateResponseDto;
import com.example.backend.entities.User;
import com.example.backend.exceptions.AlreadyVerifiedException;
import com.example.backend.exceptions.DuplicateFieldException;
import com.example.backend.repositories.UserRepository;
import com.example.backend.utils.JwtTokenUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
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

                // wait for requirement
//                    if (userRepository.existsByIdCardNumber(idCard)) {
//                        throw new DuplicateFieldException("idCardNumber", idCard);
//                    }

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
    public Map<String, Object> authenticate(JwtRequestUser user) {
        User finduser = userRepository.getUserByEmail(user.getEmail());

        if (finduser == null) {
            throw new IllegalArgumentException("User not found");
        }
        boolean match = passwordEncoder.matches(user.getPassword(), finduser.getPasswordHash());
        if (!match) {
            throw new IllegalArgumentException("Wrong password");
        }
        return Map.of(
                "access_token",
                "string",
                "refresh_token",
                "string"
        );



    }

}
