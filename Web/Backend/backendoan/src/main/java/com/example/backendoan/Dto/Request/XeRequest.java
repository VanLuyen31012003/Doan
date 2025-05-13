package com.example.backendoan.Dto.Request;

import com.example.backendoan.Entity.MauXe;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class XeRequest {
    private String bienSo;
    private Integer  mauXeId;
    private Integer trangThai;
    private Date ngayDangKy;
}
