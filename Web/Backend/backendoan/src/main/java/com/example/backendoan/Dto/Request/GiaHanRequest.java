package com.example.backendoan.Dto.Request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class GiaHanRequest {
    private LocalDateTime newEndDate; // Ngày kết thúc mới
}

