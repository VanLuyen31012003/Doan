package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "hang_xe")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HangXe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hang_xe_id")
    private Integer hangXeId;

    @Column(name = "ten_hang", nullable = false, length = 255)
    private String tenHang;

    // Mối quan hệ One-to-Many với MauXe
    @OneToMany(mappedBy = "hangXeId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MauXe> mauXeList;
}
