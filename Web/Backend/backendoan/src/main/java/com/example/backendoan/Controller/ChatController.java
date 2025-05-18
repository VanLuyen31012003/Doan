package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.ChatObjectResponse;
import com.example.backendoan.Entity.ChatMessage;
import com.example.backendoan.Entity.KhachHang;
import com.example.backendoan.Repository.ChatMessageRepository;
import com.example.backendoan.Repository.KhachHangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatMessageRepository chatMessageRepository;
    private KhachHang khachHang;
    @Autowired
    private KhachHangRepository khachHangRepository;

    @GetMapping ("/conversations")
    public ApiResponse<List<ChatObjectResponse>> getConversations(@RequestParam String userId) {
        List<ChatMessage> messages = chatMessageRepository.findBySenderIdOrReceiverId(userId, userId);
        List<String>s= messages.stream()
                .map(msg -> msg.getSenderId().equals(userId) ? msg.getReceiverId() : msg.getSenderId())
                .filter(id -> !id.equals(userId)) // Loại bỏ chính userId khỏi kết quả
                .distinct()
                .collect(Collectors.toList());
        List<ChatObjectResponse> chatObjectResponses = s.stream()
                .map(id -> ChatObjectResponse.builder()
                        .id(id)
                        .name(khachHangRepository.findById(Integer.parseInt(id)).orElse(new KhachHang()).getHoTen())
                        .build())
                .collect(Collectors.toList());
        return ApiResponse.<List<ChatObjectResponse>>builder()
                .success(true)
                .message("Lấy danh sách cuộc trò chuyện thành công")
                .data(chatObjectResponses)
                .build();
    }

    @GetMapping("/history")
    public List<Map<String, String>> getChatHistory(
            @RequestParam String userId,
            @RequestParam String otherUserId) {
        List<ChatMessage> messages = chatMessageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
                userId, otherUserId, userId, otherUserId);
        return messages.stream().map(msg -> {
            String senderName = getUserNameById(msg.getSenderId()); // Hàm lấy tên
            return Map.of(
                    "senderId", msg.getSenderId(),
                    "senderName", senderName,
                    "message", msg.getMessage(),
                    "timestamp", msg.getTimestamp().toString()
            );
        }).collect(Collectors.toList());
    }
    String getUserNameById(String userId) {
        // Giả sử bạn có một phương thức để lấy tên người dùng từ ID
        // Thay thế bằng logic thực tế của bạn
        return khachHangRepository.findById(Integer.parseInt(userId)).orElse(new KhachHang()).getHoTen();
    }
}
