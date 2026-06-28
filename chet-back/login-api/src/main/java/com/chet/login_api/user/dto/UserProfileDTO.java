package com.chet.login_api.user.dto;

import java.util.UUID;

public record UserProfileDTO(
        UUID id,
        String name,
        String username,
        String email,
        String bio,
        String avatarUrl

) {
}
