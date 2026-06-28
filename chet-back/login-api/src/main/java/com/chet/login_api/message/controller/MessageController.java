package com.chet.login_api.message.controller;

import com.chet.login_api.message.dto.MessageDTO;
import com.chet.login_api.message.dto.SendMessageDTO;
import com.chet.login_api.message.service.MessageService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{conversationId}")
    public MessageDTO sendMessage(
            @PathVariable UUID conversationId,
            @RequestBody SendMessageDTO dto
    ) {
        return messageService.sendMessage(conversationId, dto);
    }

    @GetMapping("/{conversationId}")
    public List<MessageDTO> loadMessages(
            @PathVariable UUID conversationId
    ) {
        return messageService.loadConversationMessages(conversationId);
    }

    // 🔥 NOVAS ROTAS ADICIONADAS AQUI (Editar e Apagar) 🔥

    @PutMapping("/{messageId}")
    public MessageDTO editMessage(
            @PathVariable UUID messageId,
            @RequestBody SendMessageDTO dto
    ) {
        return messageService.editMessage(messageId, dto);
    }

    @DeleteMapping("/{messageId}")
    public void deleteMessage(
            @PathVariable UUID messageId
    ) {
        messageService.deleteMessage(messageId);
    }
}