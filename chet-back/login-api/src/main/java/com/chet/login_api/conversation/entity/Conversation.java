package com.chet.login_api.conversation.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "conversations")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = true)
    private String name;

    @Column(name = "created_by")
    private UUID createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}