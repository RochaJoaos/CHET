package com.chet.login_api.conversation.dto;

import com.chet.login_api.user.entity.UserStatus;
import java.util.UUID;

public class ConversationListItemDTO {
    private UUID id;
    private String name;
    private String type;
    private UUID otherUserId;
    private UserStatus status;

    public ConversationListItemDTO(UUID id, String name, String type, UUID otherUserId, UserStatus status) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.otherUserId = otherUserId;
        this.status = status;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public UUID getOtherUserId() { return otherUserId; }
    public void setOtherUserId(UUID otherUserId) { this.otherUserId = otherUserId; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
}