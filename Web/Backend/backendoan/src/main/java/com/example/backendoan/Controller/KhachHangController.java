package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.KhachHangReponse;
import com.example.backendoan.Service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/khachhang")
public class KhachHangController {
    @Autowired
    KhachHangService khachHangService;
    //lấy thông tin khách hàng qua token
    @GetMapping("/getmyinfo")
    public ApiResponse<KhachHangReponse> getMyInfo() {
        return ApiResponse.<KhachHangReponse>builder()
                .message("Lấy thông tin khách hàng thành công")
                .data(khachHangService.getMyInfo())
                .build();
    }
    // đăng ký tài khoản
    @PostMapping("/registerkhachhang")
    public ApiResponse<KhachHangReponse> registerKhachHang(@RequestBody KhachHangReponse khachHangReponse) {
        return ApiResponse.<KhachHangReponse>builder()
                .message("Đăng ký tài khoản thành công")
                .data(khachHangService.registerKhachHang(khachHangReponse))
                .build();
    }






}
