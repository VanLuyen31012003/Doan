package com.example.backendoan.Entity;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "danh_gia")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DanhGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "danh_gia_id")
    private Integer danhGiaId;

//    @ManyToOne
    @JoinColumn(name = "khach_hang_id")
    private Integer khachHangId;


  @JoinColumn(name = "mau_xe_id")
    private Integer mauXeId;

    @Column(name = "so_sao")
    private Integer soSao;

    @Column(name = "binh_luan", columnDefinition = "TEXT")
    private String binhLuan;

    @Column(name = "ngay_danh_gia")
    private LocalDateTime ngayDanhGia;

    // Tự động gán giá trị cho ngayDanhGia nếu null
    @PrePersist
    protected void onCreate() {
        if (this.ngayDanhGia == null) {
            this.ngayDanhGia = LocalDateTime.now();
        }
    }

}
