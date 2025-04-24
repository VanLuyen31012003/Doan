package com.example.backendoan.Dto.Response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KhachHangReponse {
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String matKhau;

}
