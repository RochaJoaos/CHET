package com.chet.login_api.message.controller;

import com.chet.login_api.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.chet.login_api.message.dto.MessagesPageDTO;

@RestController
@RequestMapping("/messages")

public class MessagesController {

    @GetMapping
    public MessagesPageDTO loadMessagesPage(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return new MessagesPageDTO(
                user.getName(),
                user.getEmail()
        );
    }
}
