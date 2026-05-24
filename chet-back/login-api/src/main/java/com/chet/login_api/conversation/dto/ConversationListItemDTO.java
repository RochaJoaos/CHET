package com.chet.login_api.conversation.dto;

import java.util.UUID;

public record ConversationListItemDTO(
        UUID id,
        String name
) {
}