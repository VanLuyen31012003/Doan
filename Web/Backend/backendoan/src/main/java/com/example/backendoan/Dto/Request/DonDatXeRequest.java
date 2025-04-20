package com.example.backendoan.Dto.Request;

import com.example.backendoan.Entity.ChiTietDonDatXe;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DonDatXeRequest {
    private Integer khachHangId;
    private Integer nguoiDungId;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private BigDecimal tongTien;
    private Integer trangThai = 0;
    private String diaDiemNhanXe;
    private List<ChiTietRequest> chiTiet = new ArrayList<>();
}