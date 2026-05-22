package com.chet.login_api.user.controller;

import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")

@RequiredArgsConstructor

public class UserController {

    private final UserService service;

    @GetMapping
    public ResponseEntity<List<User>> getUsers() {

        List<User> users = service.getAllUsers();

        return ResponseEntity.ok(users);
    }
}