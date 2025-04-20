package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_don_dat_xe")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChiTietDonDatXe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chi_tiet_id")
    private Integer chiTietId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "don_dat_xe_id", nullable = false)
    private DonDatXe donDatXe;

    @Column(name = "xe_id", nullable = false)
    private Integer xeId;

    @Column(name = "so_ngay_thue", nullable = false)
    private Integer soNgayThue;

    @Column(name = "thanh_tien", nullable = false)
    private BigDecimal thanhTien;


}
