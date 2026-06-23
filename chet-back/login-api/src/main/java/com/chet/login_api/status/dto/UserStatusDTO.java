package com.chet.login_api.status.dto;

import com.chet.login_api.user.entity.UserStatus;

import java.util.UUID;

public record UserStatusDTO(
        UUID userId,
        String name,
        UserStatus status
) {
}
