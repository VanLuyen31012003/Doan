package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "loai_xe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiXe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "loai_xe_id")
    private Integer loaiXeId;

    @Column(name = "ten_loai", nullable = false, length = 255)
    private String tenLoai;

    // Mối quan hệ One-to-Many với MauXe
    @OneToMany(mappedBy = "loaiXeId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MauXe> mauXeList;

}
