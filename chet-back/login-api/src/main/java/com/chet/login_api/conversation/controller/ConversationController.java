package com.chet.login_api.conversation.controller;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.service.ConversationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService service;

    public ConversationController(ConversationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Conversation> getAll(Authentication auth) {
        return service.getAll(auth);
    }

    @PostMapping
    public Conversation create(@RequestBody Conversation conversation, Authentication auth) {
        return service.create(conversation, auth);
    }
}