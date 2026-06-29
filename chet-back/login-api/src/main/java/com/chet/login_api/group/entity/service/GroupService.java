package com.chet.login_api.group.service; // Verifique se o pacote bate com a sua pasta (se for group.entity.service, altere aqui)

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.entity.ConversationParticipant;
import com.chet.login_api.conversation.repository.ConversationParticipantRepository;
import com.chet.login_api.conversation.repository.ConversationRepository;
import com.chet.login_api.conversation.dto.ConversationListItemDTO;
import com.chet.login_api.group.dto.CreateGroupDTO;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.entity.UserStatus; // <-- IMPORTAÇÃO ADICIONADA
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final UserRepository userRepository;

    public ConversationListItemDTO createGroup(CreateGroupDTO request) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new RuntimeException("Auth está null");
        }

        User currentUser = (User) auth.getPrincipal();

        // 1. Cria a conversa definindo o tipo como GRUPO
        Conversation group = new Conversation();
        group.setType("GROUP");
        group.setName(request.getName());
        group.setCreatedBy(currentUser.getId());
        
        group = conversationRepository.save(group);

        // 2. Adiciona o usuário atual (criador) ao grupo
        ConversationParticipant creatorParticipant = new ConversationParticipant();
        creatorParticipant.setConversation(group);
        creatorParticipant.setUser(currentUser);
        participantRepository.save(creatorParticipant);

        // 3. Adiciona os convidados ao grupo
        for (String userIdStr : request.getUserIds()) {
            UUID userId = UUID.fromString(userIdStr);
            User invitedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userIdStr));

            ConversationParticipant participant = new ConversationParticipant();
            participant.setConversation(group);
            participant.setUser(invitedUser);
            participantRepository.save(participant);
        }

        // 4. Retorna a confirmação para a tela usando o Enum correto
        return new ConversationListItemDTO(
                group.getId(),
                group.getName(),
                null,
                UserStatus.ONLINE // <-- CORREÇÃO AQUI
        );
    }
}