package com.chet.login_api.conversation.controller;

import com.chet.login_api.conversation.dto.ConversationListItemDTO;
import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/conversations")
@RequiredArgsConstructor

public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("/private/{targetUserId}")
    public Conversation createPrivateConversation(
            @PathVariable UUID targetUserId
    ) {

        return conversationService
                .createPrivateConversation(targetUserId);
    }

    @GetMapping
    public List<ConversationListItemDTO>
    loadUserConversations() {

        return conversationService
                .loadUserConversations();
    }
}