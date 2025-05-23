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
    @GetMapping("/getallkhachhang")
    public ApiResponse<?> getAllKhachHang() {
        return ApiResponse.<Object>builder()
                .message("Lấy danh sách khách hàng thành công")
                .data(khachHangService.getAllKhachHang())
                .build();
    }
    //xoa khach hang
    @DeleteMapping("/deletekhachhang/{id}")
    public ApiResponse<?> deleteKhachHang(@PathVariable int id) {
        khachHangService.deleteKhachHang(id);
        return ApiResponse.<Object>builder()
                .message("Xóa khách hàng thành công")
                .data(null)
                .build();
    }
    //sua khach hang
    @PutMapping("/updatekhachhang/{id}")
    public ApiResponse<?> updateKhachHang(@PathVariable int id, @RequestBody KhachHangReponse khachHangReponse) {
        return ApiResponse.<Object>builder()
                .message("Cập nhật khách hàng thành công")
                .data(khachHangService.updateKhachHang(id, khachHangReponse))
                .build();
    }
    @PutMapping("/updateinfo")
    public ApiResponse<?> updateKhachHang( @RequestBody KhachHangReponse khachHangReponse) {
        return ApiResponse.<Object>builder()
                .message("Cập nhật khách hàng thành công")
                .data(khachHangService.updateinfo( khachHangReponse))
                .build();
    }
    //lay thong tin khach hang qua id
    @GetMapping("/getkhachhang/{id}")
    public ApiResponse<?> getKhachHangById(@PathVariable int id) {
        return ApiResponse.<Object>builder()
                .message("Lấy thông tin khách hàng thành công")
                .data(khachHangService.getKhachHangById(id))
                .build();
    }






}
