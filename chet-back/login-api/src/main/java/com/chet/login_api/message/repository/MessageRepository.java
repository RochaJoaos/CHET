package com.chet.login_api.message.repository;

import com.chet.login_api.message.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository
        extends JpaRepository<Message, UUID> {

    List<Message>
    findByConversationIdOrderByCreatedAtAsc(
            UUID conversationId
    );
}