package com.chet.login_api.group.service;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.entity.ConversationParticipant;
import com.chet.login_api.conversation.repository.ConversationParticipantRepository;
import com.chet.login_api.conversation.repository.ConversationRepository;
import com.chet.login_api.conversation.dto.ConversationListItemDTO;
import com.chet.login_api.group.dto.CreateGroupDTO;
import com.chet.login_api.infra.security.AuthenticatedUserService;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public ConversationListItemDTO createGroup(CreateGroupDTO request) {
        User currentUser = userRepository.findById(authenticatedUserService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Conversation group = new Conversation();
        group.setType("GROUP");
        group.setName(request.getName());
        group.setCreatedBy(currentUser.getId());
        group = conversationRepository.save(group);

        ConversationParticipant creatorParticipant = new ConversationParticipant();
        creatorParticipant.setConversation(group);
        creatorParticipant.setUser(currentUser);
        participantRepository.save(creatorParticipant);

        if (request.getUserIds() != null) {
            for (String userIdStr : request.getUserIds()) {
                UUID userId = UUID.fromString(userIdStr);
                User invitedUser = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userIdStr));
                
                if (invitedUser.getId().equals(currentUser.getId())) continue;

                ConversationParticipant participant = new ConversationParticipant();
                participant.setConversation(group);
                participant.setUser(invitedUser);
                participantRepository.save(participant);
            }
        }
        return new ConversationListItemDTO(group.getId(), group.getName(), "GROUP", null, null);
    }

    public ConversationListItemDTO renameGroup(UUID groupId, String newName) {
        Conversation group = conversationRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado."));
        if (!group.getType().equals("GROUP")) throw new RuntimeException("Esta conversa não é um grupo.");
        group.setName(newName);
        conversationRepository.save(group);
        return new ConversationListItemDTO(group.getId(), group.getName(), "GROUP", null, null);
    }

    public void addParticipant(UUID groupId, String userId) {
        Conversation group = conversationRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado."));
        UUID uid = UUID.fromString(userId);
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        
        boolean alreadyIn = participantRepository.findByConversationId(groupId)
                .stream().anyMatch(p -> p.getUser().getId().equals(uid));

        if (alreadyIn) throw new RuntimeException("Usuário já é participante.");

        ConversationParticipant participant = new ConversationParticipant();
        participant.setConversation(group);
        participant.setUser(user);
        participantRepository.save(participant);
    }

    public void deleteGroup(UUID groupId) {
        Conversation group = conversationRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado."));
        participantRepository.deleteAll(participantRepository.findByConversationId(groupId));
        conversationRepository.delete(group);
    }
}