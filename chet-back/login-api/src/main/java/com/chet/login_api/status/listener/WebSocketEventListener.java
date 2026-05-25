package com.chet.login_api.status.listener;

import com.chet.login_api.status.service.OnlineUsersService;
import com.chet.login_api.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final OnlineUsersService onlineUsersService;

    @EventListener
    public void handleWebSocketConnectListener(

            SessionConnectEvent event
    ) {

        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null) return;

        User user = (User) auth.getPrincipal();

        onlineUsersService.addUser(user.getId());

        System.out.println(
                user.getName() + " ficou ONLINE"
        );
    }

    @EventListener
    public void handleWebSocketDisconnectListener(

            SessionDisconnectEvent event
    ) {

        StompHeaderAccessor headerAccessor =
                StompHeaderAccessor.wrap(
                        event.getMessage()
                );

        var auth = (User)
                headerAccessor
                        .getUser();

        if (auth == null) return;

        onlineUsersService.removeUser(auth.getId());

        System.out.println(
                auth.getName() + " ficou OFFLINE"
        );
    }
}