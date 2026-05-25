package com.chet.login_api.message.service;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.repository.ConversationRepository;
import com.chet.login_api.message.dto.MessageDTO;
import com.chet.login_api.message.dto.SendMessageDTO;
import com.chet.login_api.message.entity.Message;
import com.chet.login_api.message.repository.MessageRepository;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class MessageService {

    private final MessageRepository messageRepository;

    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public MessageDTO sendMessage(
            UUID conversationId,
            SendMessageDTO dto
    ) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User sender = userRepository
                .findByEmail(email)
                .orElseThrow();

        Conversation conversation =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow();

        Message message = new Message();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(dto.content());
        message.setCreatedAt(LocalDateTime.now());
        message = messageRepository.save(message);

        MessageDTO response = new MessageDTO(
                message.getId(),
                sender.getId(),
                sender.getName(),
                message.getContent(),
                message.getCreatedAt()
        );

        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, response);
        return response;
    }

    public List<MessageDTO>
    loadConversationMessages(UUID conversationId) {

        return messageRepository
                .findByConversationIdOrderByCreatedAtAsc(
                        conversationId
                )
                .stream()
                .map(message -> new MessageDTO(
                        message.getId(),
                        message.getSender().getId(),
                        message.getSender().getName(),
                        message.getContent(),
                        message.getCreatedAt()

                ))
                .toList();
    }
}