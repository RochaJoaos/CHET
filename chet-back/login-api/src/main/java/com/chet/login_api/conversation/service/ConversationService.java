package com.chet.login_api.conversation.service;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.entity.ConversationParticipant;
import com.chet.login_api.conversation.repository.ConversationParticipantRepository;
import com.chet.login_api.conversation.repository.ConversationRepository;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;

    private final ConversationParticipantRepository participantRepository;

    private final UserRepository userRepository;

    public Conversation createPrivateConversation(UUID targetUserId) {

        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        System.out.println("AUTH:");
        System.out.println(auth);

        if (auth == null) {
            throw new RuntimeException("Auth está null");
        }

        String email = auth.getName();

        System.out.println("EMAIL:");
        System.out.println(email);

        User currentUser = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        User targetUser = userRepository
                .findById(targetUserId)
                .orElseThrow(() ->
                        new RuntimeException("Usuário alvo não encontrado"));

        // impede criar conversa consigo mesmo
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("Você não pode criar conversa consigo mesmo");
        }

        // cria conversa
        Conversation conversation = new Conversation();

        conversation.setType("PRIVATE");

        conversation.setName(null);

        conversation.setCreatedBy(currentUser.getId());

        conversation = conversationRepository.save(conversation);

        // adiciona usuário atual
        ConversationParticipant currentParticipant =
                new ConversationParticipant();

        currentParticipant.setConversation(conversation);

        currentParticipant.setUser(currentUser);

        participantRepository.save(currentParticipant);

        // adiciona usuário alvo
        ConversationParticipant targetParticipant =
                new ConversationParticipant();

        targetParticipant.setConversation(conversation);

        targetParticipant.setUser(targetUser);

        participantRepository.save(targetParticipant);

        return conversation;
    }
}