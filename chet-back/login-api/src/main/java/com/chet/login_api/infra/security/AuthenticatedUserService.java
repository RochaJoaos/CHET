package com.chet.login_api.infra.security;

import com.chet.login_api.user.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticatedUserService {

    public User getCurrentUser() {

        var authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null) {
            throw new RuntimeException("Usuário não autenticado.");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User user)) {
            throw new RuntimeException("Principal inválido.");
        }

        return user;
    }
}
