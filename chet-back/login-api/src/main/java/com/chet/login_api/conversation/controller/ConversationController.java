package com.chet.login_api.conversation.controller;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/conversations")

@RequiredArgsConstructor

public class ConversationController {

    private final ConversationService service;

    @PostMapping("/private/{userId}")
    public ResponseEntity<Conversation>
    createConversation(@PathVariable UUID userId) {

        Conversation conversation =
                service.createPrivateConversation(userId);

        return ResponseEntity.ok(conversation);
    }
}