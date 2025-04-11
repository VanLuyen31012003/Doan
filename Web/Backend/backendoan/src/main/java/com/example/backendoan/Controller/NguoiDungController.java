package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Request.NguoiDungRequest;
import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.NguoiDungResponse;
import com.example.backendoan.Service.NguoiDungService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.backendoan.Entity.NguoiDung;

import java.util.List;

@RestController
@RequestMapping("/api/nguoidung")
public class NguoiDungController {
    @Autowired
    NguoiDungService nguoi_dungService;
    @GetMapping("/hello")
    public String hello(){
        return "hello";
    }
    @GetMapping("/getallnguoidung")
    public ApiResponse< List<NguoiDungResponse>> getallnguoidung(){
        return ApiResponse.<List<NguoiDungResponse>>builder()
                .message("Lấy danh sách người dùng thành công")
                .data(nguoi_dungService.getnguoi_dung())
                .build();
    };
    @PostMapping("/addnguoidung")
    public ApiResponse<NguoiDungResponse> addnguoidung(@RequestBody NguoiDungRequest nguoiDungRequest){
        return ApiResponse.<NguoiDungResponse>builder()
                .message("add thành công")
                .data(nguoi_dungService.addnguoidung(nguoiDungRequest))
                .build();
    }

}
