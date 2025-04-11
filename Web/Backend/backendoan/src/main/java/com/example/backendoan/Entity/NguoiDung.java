package com.example.backendoan.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "nguoi_dung")  // Tên bảng trong cơ sở dữ liệu
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // Thiết lập tự tăng
    int nguoi_dung_id;
     String  ho_ten ;
     String  email ;
     String  mat_khau ;
     Integer vai_tro;
}
