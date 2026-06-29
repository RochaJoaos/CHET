package com.chet.login_api.user.service;

import com.chet.login_api.infra.security.AuthenticatedUserService;
import com.chet.login_api.user.dto.UpdateProfileDTO;
import com.chet.login_api.user.dto.UserProfileDTO;
import  com.chet.login_api.user.dto.UserListDTO;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final AuthenticatedUserService authenticatedUserService;

    public List<UserListDTO> getAllUsers() {

        return repository.findAll()
                .stream()
                .map(user ->
                        new UserListDTO(

                                user.getId(),
                                user.getName(),
                                user.getAvatarUrl(),
                                user.getStatus()
                        )
                )
                .toList();
    }

    public UserProfileDTO getProfile() {

        User user = authenticatedUserService.getCurrentUser();

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getBio(),
                user.getAvatarUrl()
        );
    }

    public UserProfileDTO updateProfile(
            UpdateProfileDTO dto
    ) {

        User user = authenticatedUserService.getCurrentUser();

        user.setName(dto.name());
        user.setUsername(dto.username());
        user.setBio(dto.bio());

        repository.save(user);

        return getProfile();
    }
}