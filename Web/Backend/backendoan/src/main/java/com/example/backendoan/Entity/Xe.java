package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
 @Table(name = "xe")
public class Xe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "xe_id")
    private Integer xeId;

    @Column(name = "bien_so", nullable = false, unique = true)
    private String bienSo;

    @ManyToOne
    @JoinColumn(name = "mau_xe_id")
    private MauXe mauXe;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ngay_dang_ky")
    private Date ngayDangKy;
}
