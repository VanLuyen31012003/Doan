package com.example.backendoan.Dto.Response;

import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.Xe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietDonDatXeReponse {
    private Integer chiTietId;
//    private Integer xeId;
    private Xe xe;
    private Integer soNgayThue;
    private BigDecimal thanhTien;
}
