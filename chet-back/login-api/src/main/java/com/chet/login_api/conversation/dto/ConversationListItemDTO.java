package com.chet.login_api.conversation.dto;

import com.chet.login_api.user.entity.UserStatus;
import java.util.UUID;

public record ConversationListItemDTO(
        UUID id,
        String name,
        UUID otherUserId,
        UserStatus status
) {}