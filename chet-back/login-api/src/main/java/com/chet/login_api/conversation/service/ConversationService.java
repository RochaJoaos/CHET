package com.chet.login_api.conversation.service;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.repository.ConversationRepository;
import com.chet.login_api.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationService {

    private final ConversationRepository repository;

    public ConversationService(ConversationRepository repository) {
        this.repository = repository;
    }

    public List<Conversation> getAll(Authentication auth) {
        User user = (User) auth.getPrincipal();

        return repository.findAll();
    }

    public Conversation create(Conversation conversation, Authentication auth) {
        User user = (User) auth.getPrincipal();

        conversation.setCreatedBy(user.getId());

        return repository.save(conversation);
    }
}