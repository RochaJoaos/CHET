package com.chet.login_api.message.entity;

import com.chet.login_api.conversation.entity.Conversation;
import com.chet.login_api.user.entity.User;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")

@Getter
@Setter

@AllArgsConstructor
@NoArgsConstructor

public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    private UUID id;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdAt;
}