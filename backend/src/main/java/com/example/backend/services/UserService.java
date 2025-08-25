package com.example.backend.services;

import com.example.backend.dtos.UserCreateRequestDto;
import com.example.backend.dtos.UserCreateResponseDto;
import com.example.backend.entities.User;
import com.example.backend.exceptions.DuplicateFieldException;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private FileStorage fileStorage;

    private String t(String s) { return s == null ? null : s.trim(); }

    public UserCreateResponseDto registerUsers(UserCreateRequestDto dto) throws IOException {
        Optional<User> existing = userRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }
        String email = t(dto.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateFieldException("email", email);
        }
        String userType = t(dto.getUserType()).toUpperCase();
        String idCard = t(dto.getIdCardNumber());
        if ("SELLER".equals(userType) && idCard != null && !idCard.isEmpty()) {
            if (userRepository.existsByIdCardNumber(idCard)) {
                throw new DuplicateFieldException("idCardNumber", idCard);
            }
        }

        User user = new User();
        user.setNickName(t(dto.getNickName()));
        user.setEmail(t(dto.getEmail()));
        user.setFullName(t(dto.getFullName()));
        user.setPasswordHash(passwordEncoder.encode(t(dto.getPassword())));
        user.setUserType(t(dto.getUserType()).toUpperCase());
        user.setPhoneNumber(t(dto.getPhoneNumber()));
        user.setBankAccount(t(dto.getBankAccount()));
        user.setBankName(t(dto.getBankName()));
        user.setIdCardNumber(t(dto.getIdCardNumber()));
        user.setIsActive(false);
        User saved = userRepository.save(user);

        if (dto.getIdCardImageFront() != null && !dto.getIdCardImageFront().isEmpty()) {
            var f = fileStorage.storeUserIdCardFile(saved.getId(), dto.getIdCardImageFront(), "front");
            saved.setIdCardImageFront(f.getPath());
        }
        if (dto.getIdCardImageBack() != null && !dto.getIdCardImageBack().isEmpty()) {
            var b = fileStorage.storeUserIdCardFile(saved.getId(), dto.getIdCardImageBack(), "back");
            saved.setIdCardImageBack(b.getPath());
        }

        if (saved.getIdCardImageFront() != null || saved.getIdCardImageBack() != null) {
            saved = userRepository.save(saved);
        }

        UserCreateResponseDto response = new UserCreateResponseDto();
        response.setId(saved.getId());
        response.setNickName(saved.getNickName());
        response.setEmail(saved.getEmail());
        response.setFullName(saved.getFullName());
        response.setPhoneNumber(saved.getPhoneNumber());
        response.setActive(saved.getIsActive());
        response.setUserType(saved.getUserType());
        return response;
    }
}
