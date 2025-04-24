package com.example.backendoan.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DanhGiaResponse {
    private Integer danhGiaId;
    private Integer khachHangId;
    private String hoTenKhachHang; // Tên khách hàng
    private Integer mauXeId;
    private Integer soSao;
    private String binhLuan;
    private String ngayDanhGia;
}
