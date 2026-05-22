package com.chet.login_api.user.service;

import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class UserService {

    private final UserRepository repository;

    public List<User> getAllUsers() {

        return repository.findAll();
    }
}