package com.example.backendoan.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MauXeRequest {
    private String tenMau;
    private Double giaThueNgay;
    private String moTa;
    private MultipartFile anhDefault;
    private Integer loaiXeId;
    private Integer hangxeId;
}
