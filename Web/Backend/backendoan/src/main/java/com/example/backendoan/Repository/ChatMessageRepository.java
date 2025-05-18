package com.example.backendoan.Repository;

import com.example.backendoan.Entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
            String senderId, String receiverId, String receiverId2, String senderId2);

    List<ChatMessage> findBySenderIdOrReceiverId(String senderId, String receiverId);
}
