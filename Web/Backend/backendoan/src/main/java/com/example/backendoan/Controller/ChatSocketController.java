package com.example.backendoan.Controller;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import com.example.backendoan.Entity.ChatMessage;
import com.example.backendoan.Repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class ChatSocketController {
    private final SocketIOServer socketIOServer;
    private final ChatMessageRepository chatMessageRepository;
    private final Map<String, SocketIOClient> connectedClients = new ConcurrentHashMap<>();

    @OnConnect
    public void onConnect(SocketIOClient client) {
        String sessionId = client.getSessionId().toString();
        String userId = client.getHandshakeData().getSingleUrlParam("userId");
        System.out.println("Client connecting - Session ID: " + sessionId + ", UserId: " + userId);
        if (userId != null) {
            connectedClients.put(userId, client);
            client.set("userId", userId);
            System.out.println("Client connected: " + userId + " at " + LocalDateTime.now());
            socketIOServer.getBroadcastOperations().sendEvent("user_connected", userId);
        } else {
            System.out.println("No userId found in handshake for session " + sessionId + ", disconnecting client");
            client.disconnect();
        }
    }

    @OnDisconnect
    public void onDisconnect(SocketIOClient client) {
        String userId = client.get("userId");
        if (userId != null) {
            connectedClients.remove(userId);
            System.out.println("Client disconnected: " + userId + " at " + LocalDateTime.now());
            socketIOServer.getBroadcastOperations().sendEvent("user_disconnected", userId);
        }
    }

    @OnEvent("join_room")
    public void onJoinRoom(SocketIOClient client, Map<String, String> data) {
        String userId = client.get("userId");
        String otherUserId = data.get("otherUserId");
        if (userId != null && otherUserId != null) {
            String roomId = createRoomId(userId, otherUserId);
            client.joinRoom(roomId);
            System.out.println(userId + " joined room " + roomId);
        }
    }

    @OnEvent("send_message")
    public void onSendMessage(SocketIOClient client, AckRequest ackRequest, Map<String, String> data) {
        String senderId = client.get("userId");
        String receiverId = data.get("receiverId");
        String message = data.get("message");

        if (senderId != null && receiverId != null && message != null) {
            String roomId = createRoomId(senderId, receiverId);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSenderId(senderId);
            chatMessage.setReceiverId(receiverId);
            chatMessage.setMessage(message);
            chatMessage.setTimestamp(LocalDateTime.now());
            chatMessageRepository.save(chatMessage);

            socketIOServer.getRoomOperations(roomId).sendEvent("receive_message", Map.of(
                    "senderId", senderId,
                    "message", message,
                    "timestamp", chatMessage.getTimestamp().toString()
            ));

            SocketIOClient receiverClient = connectedClients.get(receiverId);
            if (receiverClient != null && receiverClient.isChannelOpen()) {
                receiverClient.sendEvent("new_message_notification", Map.of(
                        "senderId", senderId,
                        "timestamp", chatMessage.getTimestamp().toString()
                ));
            }

            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData(true);
            }
        }
    }

    private String createRoomId(String userId1, String userId2) {
        return userId1.compareTo(userId2) < 0 ? userId1 + "-" + userId2 : userId2 + "-" + userId1;
    }
}
