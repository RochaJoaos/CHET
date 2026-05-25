package com.chet.login_api.status.service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OnlineUsersService {

    private final Set<UUID> onlineUsers =
            ConcurrentHashMap.newKeySet();

    public void addUser(UUID userId) {

        onlineUsers.add(userId);
    }

    public void removeUser(UUID userId) {

        onlineUsers.remove(userId);
    }

    public boolean isOnline(UUID userId) {

        return onlineUsers.contains(userId);
    }
}