package com.chet.login_api.message.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageDTO(

        UUID id,

        UUID senderId,

        String senderName,

        String content,

        LocalDateTime createdAt

) {
}