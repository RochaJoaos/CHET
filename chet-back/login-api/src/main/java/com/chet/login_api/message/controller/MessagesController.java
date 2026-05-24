package com.chet.login_api.message.controller;

import com.chet.login_api.message.dto.MessagesPageDTO;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor

public class MessagesController {

    private final UserRepository userRepository;

    @GetMapping
    public MessagesPageDTO loadMessagesPage(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado"));

        return new MessagesPageDTO(
                user.getName(),
                user.getEmail()
        );
    }
}
