package com.chet.login_api.status.controller;

import com.chet.login_api.status.service.OnlineUsersService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/status")
@RequiredArgsConstructor
public class StatusController {

    private final OnlineUsersService
            onlineUsersService;

    @GetMapping("/{userId}")
    public boolean isOnline(

            @PathVariable UUID userId
    ) {

        return onlineUsersService
                .isOnline(userId);
    }
}
