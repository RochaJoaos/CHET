package com.chet.login_api.conversation.dto;

import com.chet.login_api.user.entity.UserStatus;
import java.util.UUID;

public class ConversationListItemDTO {
    private UUID id;
    private String name;
    private String type; // Adicione este campo se não existir
    private UserStatus status;

    // Adicione no construtor
    public ConversationListItemDTO(UUID id, String name, String type, UserStatus status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
    }
    // ... getters e setters ...
}