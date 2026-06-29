package com.chet.login_api.message.service;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.conversation.repository.ConversationRepository;
import com.chet.login_api.infra.security.AuthenticatedUserService;
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
    private final AuthenticatedUserService authenticatedUserService;

    public MessageDTO sendMessage(UUID conversationId, SendMessageDTO dto) {
        User sender = authenticatedUserService.getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow();

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

    public List<MessageDTO> loadConversationMessages(UUID conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
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

    // NOVOS MÉTODOS PARA EDITAR E APAGAR

    public MessageDTO editMessage(UUID messageId, SendMessageDTO dto) {
        User currentUser = authenticatedUserService.getCurrentUser();
        
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));

        // Validação de segurança: a pessoa só edita se a mensagem for dela
        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Você não tem permissão para editar esta mensagem");
        }

        message.setContent(dto.content());
        message = messageRepository.save(message);

        MessageDTO response = new MessageDTO(
                message.getId(),
                message.getSender().getId(),
                message.getSender().getName(),
                message.getContent(),
                message.getCreatedAt()
        );

        // Avisa o WebSocket para atualizar a mensagem na tela do outro usuário
        messagingTemplate.convertAndSend("/topic/conversation/" + message.getConversation().getId(), response);
        return response;
    }

    public void deleteMessage(UUID messageId) {
        User currentUser = authenticatedUserService.getCurrentUser();
        
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));

        if (!message.getSender().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Você não tem permissão para apagar esta mensagem");
        }

        UUID conversationId = message.getConversation().getId();

        // Exclui do banco de dados definitivamente
        messageRepository.delete(message);
        
        // Mandamos um DTO com o texto de aviso para o WebSocket
        // Assim o React encontra o ID antigo e substitui pelo aviso na mesma hora
        MessageDTO response = new MessageDTO(
                messageId, 
                message.getSender().getId(),
                message.getSender().getName(),
                "Mensagem apagada",
                message.getCreatedAt()
        );
        
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, response);
    }
}