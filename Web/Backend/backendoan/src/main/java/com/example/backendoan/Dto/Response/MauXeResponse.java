package com.example.backendoan.Dto.Response;

import com.example.backendoan.Entity.LoaiXe;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MauXeResponse {
    private Integer mauXeId;
    private String tenMau;
    private Double giaThueNgay;
    private String moTa;
    private String anhDefault;
    private LoaiXeReponse loaiXeReponse;
    private String tenHangXe;
    private Integer soLuongxeconlai;
}
