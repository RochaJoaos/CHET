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

        if (auth == null) {
            throw new RuntimeException("Auth está null");
        }

        String email = auth.getName();

        User currentUser = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        User targetUser = userRepository
                .findById(targetUserId)
                .orElseThrow(() ->
                        new RuntimeException("Usuário alvo não encontrado"));

        // impede conversa consigo mesmo
        if (currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException(
                    "Você não pode criar conversa consigo mesmo"
            );
        }

        // busca conversas do usuário atual
        var currentUserConversations =
                participantRepository.findByUserId(currentUser.getId());

        // verifica se já existe conversa privada
        for (ConversationParticipant participant
                : currentUserConversations) {

            Conversation conversation =
                    participant.getConversation();

            // ignora grupos
            if (!conversation.getType().equals("PRIVATE")) {
                continue;
            }

            // pega participantes da conversa
            var participants =
                    participantRepository.findByConversationId(
                            conversation.getId()
                    );

            boolean hasTargetUser = participants
                    .stream()
                    .anyMatch(p ->
                            p.getUser()
                                    .getId()
                                    .equals(targetUser.getId())
                    );

            // já existe conversa
            if (hasTargetUser) {
                return conversation;
            }
        }

        // cria conversa nova
        Conversation conversation = new Conversation();

        conversation.setType("PRIVATE");

        conversation.setName(null);

        conversation.setCreatedBy(currentUser.getId());

        conversation = conversationRepository.save(conversation);

        // participante atual
        ConversationParticipant currentParticipant =
                new ConversationParticipant();

        currentParticipant.setConversation(conversation);

        currentParticipant.setUser(currentUser);

        participantRepository.save(currentParticipant);

        // participante alvo
        ConversationParticipant targetParticipant =
                new ConversationParticipant();

        targetParticipant.setConversation(conversation);

        targetParticipant.setUser(targetUser);

        participantRepository.save(targetParticipant);

        return conversation;
    }
}