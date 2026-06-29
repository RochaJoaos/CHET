package com.chet.login_api.conversation.repository;

import com.chet.login_api.conversation.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    // Se precisar de métodos extras, adicione aqui. 
    // Por enquanto, apenas manter a interface garante que o erro de "unnamed class" suma.
}