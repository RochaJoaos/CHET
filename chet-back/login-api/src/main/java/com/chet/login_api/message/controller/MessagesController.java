package com.chet.login_api.message.controller;

import com.chet.login_api.infra.security.AuthenticatedUserService;
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

    private final AuthenticatedUserService authenticatedUserService;

    @GetMapping
    public MessagesPageDTO loadMessagesPage() {

        User user = authenticatedUserService.getCurrentUser();

        return new MessagesPageDTO(
                user.getName(),
                user.getEmail()
        );
    }
}
