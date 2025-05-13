package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Request.XeRequest;
import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Entity.HangXe;
import com.example.backendoan.Entity.LoaiXe;
import com.example.backendoan.Entity.Xe;
import com.example.backendoan.Service.XeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/xe")
public class XeController {
    @Autowired
    XeService xeService;
    // Chức năng thêm xe
    // Chức năng sửa xe

    // Chức năng xóa xe
    // Chức năng lấy danh sách xe
    @GetMapping("/getallxe")
    public ApiResponse<List<Xe>> getAllXe() {
        return ApiResponse.<List<Xe>>builder()
                .message("Lấy danh sách xe thành công")
                .data(xeService.getAllXe())
                .build();
    }
    @GetMapping("/getallhangxe")
    public ApiResponse<List<HangXe>> getAllHangXe() {
        return ApiResponse.<List<HangXe>>builder()
                .message("Lấy danh sách xe thành công")
                .data(xeService.getAllHangXe())
                .build();
    }
    @GetMapping("/getallloaixe")
    public ApiResponse<List<LoaiXe>> getAllLoaiXe() {
        return ApiResponse.<List<LoaiXe>>builder()
                .message("Lấy danh sách xe thành công")
                .data(xeService.getAllLoaiXe())
                .build();
    }
    @DeleteMapping("/deletexe/{id}")
    public ApiResponse<String> deleteXe(@PathVariable int id) {
        xeService.deleteXe(id);
        return ApiResponse.<String>builder()
                .message("Xóa xe thành công")
                .data("Xóa xe thành công")
                .build();
    }
    @PutMapping("/updatexe/{id}")
    public ApiResponse<Xe> updateXe(@RequestBody XeRequest xe, @PathVariable int id) {
        return ApiResponse.<Xe>builder()
                .message("Cập nhật xe thành công")
                .data(xeService.updateXe(xe, id))
                .build();
    }
    @PostMapping("/addxe")
    public ApiResponse<Xe>addXe(@RequestBody XeRequest xe) {
        return ApiResponse.<Xe>builder()
                .message("Thêm xe thành công")
                .data(xeService.addXe(xe))
                .build();
    }

}
