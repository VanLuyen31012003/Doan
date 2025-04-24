package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.DanhGiaResponse;
import com.example.backendoan.Dto.Response.MauXeResponse;
import com.example.backendoan.Entity.DanhGia;
import com.example.backendoan.Service.DanhGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping ("/danhgia")
public class DanhGiaController {
    @Autowired
    private DanhGiaService danhGiaService;
    // api lay danh sach danh gia theo mau xe id
    @GetMapping("/getalldanhgiabyid/{mauXeId}")
    public ApiResponse<Page<DanhGiaResponse>> getDanhGiaByMauXeIdAndSoSao(
            @PathVariable Integer mauXeId,
            @RequestParam(required = false) Integer soSao,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "ngayDanhGia,desc") String sort) {
        try {
            // Xử lý tham số sort
            String[] sortParams = sort.split(",");
            if (sortParams.length != 2) {
                throw new IllegalArgumentException("Tham số sort không hợp lệ. Định dạng: field,direction (ví dụ: ngayDanhGia,desc)");
            }
            String sortField = sortParams[0];
            Sort.Direction sortDirection = Sort.Direction.fromString(sortParams[1]);
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

            // Gọi service để lấy dữ liệu phân trang
            Page<DanhGiaResponse> danhGiaPage = danhGiaService.getDanhGiaByMauXeIdAndSoSao(mauXeId, soSao, pageable);

            return ApiResponse.<Page<DanhGiaResponse>>builder()
                    .success(true)
                    .message("Lấy danh sách đánh giá thành công")
                    .data(danhGiaPage)
                    .build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
