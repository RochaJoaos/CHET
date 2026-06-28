package com.chet.login_api.user.dto;

import com.chet.login_api.user.entity.UserStatus;

import java.util.UUID;

public record UserListDTO(

        UUID id,
        String name,
        String avatarUrl,
        UserStatus status

) {
}
