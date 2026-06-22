package com.chet.login_api.auth.controller;


import com.chet.login_api.user.entity.User;
import com.chet.login_api.auth.dto.LoginRequestDTO;
import com.chet.login_api.auth.dto.ResgisterRequestDTO;
import com.chet.login_api.auth.dto.ResponseDTO;
import com.chet.login_api.infra.security.TokenService;
import com.chet.login_api.user.repository.UserRepository;
import com.chet.login_api.user.entity.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private  final TokenService tokenservice;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO body){
        User user = this.repository.findByEmail(body.email()).orElseThrow(() -> new RuntimeException("User not found")); ///ver depois como fazer tratamento de recessão.
        if (passwordEncoder.matches(body.password(), user.getPassword())){
            user.setStatus(UserStatus.ONLINE);
            repository.save(user);
            String token = this.tokenservice.generateToken(user);
            return ResponseEntity.ok(new ResponseDTO(user.getName(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody ResgisterRequestDTO body){
        Optional<User> user = this.repository.findByEmail(body.email());

        if (user.isEmpty()){
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());
            newUser.setStatus(UserStatus.OFFLINE);
            this.repository.save(newUser);
            String token = this.tokenservice.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getName(), token));
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/logout")
    public ResponseEntity logout(@RequestBody LoginRequestDTO body){

        User user = repository.findByEmail(body.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(UserStatus.OFFLINE);

        repository.save(user);

        return ResponseEntity.ok().build();
    }
}
