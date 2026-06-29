package com.chet.login_api.conversation.service;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.entity.ConversationParticipant;
import com.chet.login_api.conversation.repository.ConversationParticipantRepository;
import com.chet.login_api.conversation.repository.ConversationRepository;
import com.chet.login_api.infra.security.AuthenticatedUserService;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.chet.login_api.conversation.dto.ConversationListItemDTO;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public Conversation createPrivateConversation(UUID targetUserId) {

        // Corrigido: Usando .getCurrentUser().getId()
        User currentUser = userRepository
                .findById(authenticatedUserService.getCurrentUser().getId())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));

        User targetUser = userRepository
                .findById(targetUserId)
                .orElseThrow(() ->
                        new RuntimeException("Usuário alvo não encontrado"));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("Você não pode criar conversa consigo mesmo");
        }

        // Corrigido: Usando findByUserId
        var currentUserConversations =
                participantRepository.findByUserId(currentUser.getId());

        for (ConversationParticipant participant : currentUserConversations) {
            Conversation conversation = participant.getConversation();

            if (!conversation.getType().equals("PRIVATE")) {
                continue;
            }

            // Corrigido: Usando findByConversationId
            var participants = participantRepository.findByConversationId(conversation.getId());

            boolean hasTargetUser = participants
                    .stream()
                    .anyMatch(p -> p.getUser().getId().equals(targetUser.getId()));

            if (hasTargetUser) {
                return conversation;
            }
        }

        Conversation conversation = new Conversation();
        conversation.setType("PRIVATE");
        conversation.setName(null);
        conversation.setCreatedBy(currentUser.getId());
        conversation = conversationRepository.save(conversation);

        ConversationParticipant currentParticipant = new ConversationParticipant();
        currentParticipant.setConversation(conversation);
        currentParticipant.setUser(currentUser);
        participantRepository.save(currentParticipant);

        ConversationParticipant targetParticipant = new ConversationParticipant();
        targetParticipant.setConversation(conversation);
        targetParticipant.setUser(targetUser);
        participantRepository.save(targetParticipant);

        return conversation;
    }

    public List<ConversationListItemDTO> loadUserConversations() {

        // Corrigido: Usando .getCurrentUser().getId()
        User currentUser = userRepository
                .findById(authenticatedUserService.getCurrentUser().getId())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));

        // Corrigido: Usando findByUserId
        var participations = participantRepository.findByUserId(currentUser.getId());

        List<ConversationListItemDTO> conversations = new ArrayList<>();

        for (ConversationParticipant participation : participations) {

            Conversation conversation = participation.getConversation();

            // Corrigido: Usando findByConversationId
            var participants = participantRepository.findByConversationId(conversation.getId());

            User otherUser = null;
            String conversationName;

            if (conversation.getType().equals("PRIVATE")) {
                for (ConversationParticipant p : participants) {
                    if (!p.getUser().getId().equals(currentUser.getId())) {
                        otherUser = p.getUser();
                        break;
                    }
                }
                conversationName = otherUser != null ? otherUser.getName() : "Conversa";
            } else {
                conversationName = conversation.getName();
            }

            conversations.add(
                new ConversationListItemDTO(
                    conversation.getId(),
                    conversationName,
                    conversation.getType(),
                    otherUser != null ? otherUser.getId() : null,
                    otherUser != null ? otherUser.getStatus() : null
                )
            );
        }

        return conversations;
    }
}