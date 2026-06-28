package com.chet.login_api.user.controller;

import com.chet.login_api.user.entity.User;
import com.chet.login_api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import  com.chet.login_api.user.dto.UserListDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.chet.login_api.user.dto.UpdateProfileDTO;
import com.chet.login_api.user.dto.UserProfileDTO;
import java.util.List;

@RestController
@RequestMapping("/users")

@RequiredArgsConstructor

public class UserController {

    private final UserService service;

    @GetMapping
    public ResponseEntity<List<UserListDTO>> getUsers() {

        return ResponseEntity.ok(
                service.getAllUsers()
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getProfile() {

        return ResponseEntity.ok(
                service.getProfile()
        );
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateProfile(

            @RequestBody UpdateProfileDTO dto
    ) {

        return ResponseEntity.ok(
                service.updateProfile(dto)
        );
    }
}