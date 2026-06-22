package com.chet.login_api.infra.websocket;

import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.entity.UserStatus;
import com.chet.login_api.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;

import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final UserRepository userRepository;

    @EventListener
    public void handleWebSocketConnect(
            SessionConnectEvent event
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        System.out.println("Socket conectado");
    }

    @EventListener
    public void handleWebSocketDisconnect(
            SessionDisconnectEvent event
    ) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(event.getMessage());

        System.out.println("Socket desconectado");
    }
}