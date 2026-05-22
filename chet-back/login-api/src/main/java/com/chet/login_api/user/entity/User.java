package com.chet.login_api.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String email;

    @JsonIgnore
    private String password;
}