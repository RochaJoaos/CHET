package com.chet.login_api.infra.websocket;

import com.chet.login_api.status.dto.UserStatusDTO;
import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.entity.UserStatus;
import com.chet.login_api.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;

import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @EventListener
    public void handleWebSocketConnect(
            SessionConnectEvent event
    ) {
        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(
                        event.getMessage()
                );

        User user = (User)
                accessor.getSessionAttributes()
                        .get("user");

        if (user != null) {

            user.setStatus(
                    UserStatus.ONLINE
            );

            userRepository.save(user);
            messagingTemplate.convertAndSend(
                    "/topic/status",
                    new UserStatusDTO(
                            user.getId(),
                            user.getStatus()
                    )
            );

            System.out.println(
                    user.getName() + " ficou ONLINE"
            );
        }

        System.out.println("Socket conectado -- Teste STATUS");
    }

    @EventListener
    public void handleWebSocketDisconnect(
            SessionDisconnectEvent event
    ) {
        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(
                        event.getMessage()
                );

        User user = (User)
                accessor.getSessionAttributes()
                        .get("user");

        if (user != null) {

            user.setStatus(
                    UserStatus.OFFLINE
            );

            userRepository.save(user);
            messagingTemplate.convertAndSend(
                    "/topic/status",
                    new UserStatusDTO(
                            user.getId(),
                            user.getStatus()
                    )
            );

            System.out.println(
                    user.getName() + " ficou OFFLINE"
            );
        }

        System.out.println("Socket desconectado -- Teste STATUS");
    }
}