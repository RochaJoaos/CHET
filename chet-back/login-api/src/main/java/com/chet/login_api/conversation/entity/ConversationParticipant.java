package com.chet.login_api.conversation.entity;

import com.chet.login_api.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "conversation_participants")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ConversationParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}