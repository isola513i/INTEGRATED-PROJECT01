package com.example.backend.services;

import com.example.backend.dtos.ProfileUpdateDto;
import com.example.backend.dtos.ProfileViewDto;
import com.example.backend.entities.User;
import com.example.backend.exceptions.ItemNotFoundException;
import com.example.backend.repositories.UserRepository;
import com.example.backend.utils.MaskingUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileViewDto getProfile(Integer requestedUserId, Integer authenticatedUserId) {
        if (!requestedUserId.equals(authenticatedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Request user id not matched with id in access token");
        }
        User user = userRepository.findById(requestedUserId)
                .orElseThrow(() -> new ItemNotFoundException("User not found"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not active");
        }
        return convertToProfileView(user);
    }

    public ProfileViewDto updateProfile(Integer requestedUserId, Integer authenticatedUserId, ProfileUpdateDto updateRequest) {
        if (!requestedUserId.equals(authenticatedUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Request user id not matched with id in access token");
        }
        User user = userRepository.findById(requestedUserId)
                .orElseThrow(() -> new ItemNotFoundException("User not found"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not active");
        }

        String updatedNickName = trim(updateRequest.getNickName());
        String updatedFullName = trim(updateRequest.getFullName());

        if (updatedNickName == null && updatedFullName == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid data");
        }

        if (updatedNickName != null) {
            if (updatedNickName.isBlank() || updatedNickName.length() > 40) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid nickname");
            }
            if (!updatedNickName.equals(user.getNickName())) {
                user.setNickName(updatedNickName);
            }
        }

        if (updatedFullName != null) {
            if (updatedFullName.isBlank() || updatedFullName.length() < 4 || updatedFullName.length() > 40) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid full name");
            }
            if (!updatedFullName.equals(user.getFullName())) {
                user.setFullName(updatedFullName);
            }
        }

        userRepository.save(user);
        return convertToProfileView(user);
    }

    private static String trim(String input) {
        return input == null ? null : input.trim();
    }

    private static ProfileViewDto convertToProfileView(User user) {
        ProfileViewDto.ProfileViewDtoBuilder profileBuilder = ProfileViewDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .userType(user.getUserType())
                .nickName(user.getNickName());

        if ("SELLER".equalsIgnoreCase(user.getUserType())) {
            profileBuilder.phoneNumber(MaskingUtil.maskKeepLast234(emptyIfNull(user.getPhoneNumber())))
                    .bankName(user.getBankName())
                    .bankAccount(MaskingUtil.maskKeepLast234(emptyIfNull(user.getBankAccount())));
        }
        return profileBuilder.build();
    }

    private static String emptyIfNull(String input) {
        return input == null ? "" : input;
    }
}
