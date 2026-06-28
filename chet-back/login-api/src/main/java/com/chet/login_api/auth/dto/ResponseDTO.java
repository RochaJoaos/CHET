package com.chet.login_api.auth.dto;
import java.util.UUID;

public record ResponseDTO (
        UUID id,
        String name,
        String username,
        String avatarUrl,
        String token
){
}
