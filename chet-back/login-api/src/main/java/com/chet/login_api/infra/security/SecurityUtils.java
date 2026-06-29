package com.chet.login_api.infra.security;

import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository repository;

    public User getCurrentUser() {

        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        AuthenticatedUser principal =
                (AuthenticatedUser) auth.getPrincipal();

        return repository
                .findById(principal.getId())
                .orElseThrow(() ->
                        new RuntimeException("Usuário não encontrado."));
    }

}
