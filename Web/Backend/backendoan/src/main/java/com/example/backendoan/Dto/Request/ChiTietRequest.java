package com.example.backendoan.Dto.Request;

import com.example.backendoan.Entity.DonDatXe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChiTietRequest  {

    private Integer xeId;
    private Integer soNgayThue;
    private BigDecimal thanhTien;
}
