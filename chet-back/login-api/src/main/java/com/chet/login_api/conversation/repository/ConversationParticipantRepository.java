package com.chet.login_api.conversation.repository;

import com.chet.login_api.conversation.entity.ConversationParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, UUID> {
    List<ConversationParticipant> findByUserId(UUID userId);
    List<ConversationParticipant> findByConversationId(UUID conversationId);
}