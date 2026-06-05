package com.chet.login_api.status.listener;

import com.chet.login_api.status.service.OnlineUsersService;
import com.chet.login_api.user.entity.User;
import lombok.RequiredArgsConstructor;
import java.security.Principal;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import com.chet.login_api.user.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final OnlineUsersService onlineUsersService;
    private final UserRepository userRepository;

    @EventListener
    public void handleWebSocketConnectListener(
            SessionConnectEvent event
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(
                        event.getMessage()
                );

        Principal principal = accessor.getUser();

        if (principal == null) return;

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        onlineUsersService.addUser(user.getId());

        System.out.println(
                user.getName() + " ficou ONLINE"
        );
    }

    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(
                        event.getMessage()
                );

        Principal principal = accessor.getUser();

        if (principal == null) return;

        User user = userRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        onlineUsersService.removeUser(user.getId());

        System.out.println(
                user.getName() + " ficou OFFLINE"
        );
    }
}