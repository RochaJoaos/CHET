package com.chet.login_api.infra.security;

import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    @Override
    public boolean beforeHandshake(

            @NonNull ServerHttpRequest request,

            @NonNull org.springframework.http.server.ServerHttpResponse response,

            @NonNull WebSocketHandler wsHandler,

            @NonNull Map<String, Object> attributes
    ) {

        if (request instanceof ServletServerHttpRequest servletRequest) {

            String token =
                    servletRequest
                            .getServletRequest()
                            .getParameter("token");

            if (token == null) {
                return false;
            }

            String id = tokenService.validateToken(token);

            if (id == null) {
                return false;
            }

            User user = userRepository
                    .findById(UUID.fromString(id))
                    .orElseThrow(() -> new RuntimeException("User Not Found"));

            attributes.put("user", user);
            servletRequest
                    .getServletRequest()
                    .setAttribute("user", user);

            return true;
        }

        return false;
    }

    @Override
    public void afterHandshake(

            @NonNull ServerHttpRequest request,

            @NonNull org.springframework.http.server.ServerHttpResponse response,

            @NonNull WebSocketHandler wsHandler,

            Exception exception
    ) {

    }
}