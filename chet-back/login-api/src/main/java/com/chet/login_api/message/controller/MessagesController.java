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

    @GetMapping
    public MessagesPageDTO loadMessagesPage(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return new MessagesPageDTO(
                user.getName(),
                user.getEmail()
        );
    }
}
