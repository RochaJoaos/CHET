package com.chet.login_api.user.service;

import com.chet.login_api.user.dto.UpdateProfileDTO;
import com.chet.login_api.user.dto.UserProfileDTO;
import  com.chet.login_api.user.dto.UserListDTO;
import org.springframework.security.core.context.SecurityContextHolder;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

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

    private User getAuthenticatedUser() {
        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        return repository
                .findByEmail(auth.getName())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));
    }

    public UserProfileDTO getProfile() {

        User user = getAuthenticatedUser();

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

        User user = getAuthenticatedUser();

        user.setName(dto.name());
        user.setUsername(dto.username());
        user.setBio(dto.bio());

        repository.save(user);

        return getProfile();
    }
}