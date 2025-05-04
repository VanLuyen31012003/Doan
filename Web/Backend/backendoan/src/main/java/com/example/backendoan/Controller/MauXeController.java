package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Request.MauXeRequest;
import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.MauXeResponse;
import com.example.backendoan.Entity.AnhXe;
import com.example.backendoan.Entity.HangXe;
import com.example.backendoan.Entity.LoaiXe;
import com.example.backendoan.Service.MauXeService;
import lombok.extern.java.Log;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/mauxe")
public class MauXeController {

    @Autowired
    private MauXeService mauXeService;

    @GetMapping("/getallmauxe")
    public ApiResponse<Page<MauXeResponse>> getAllMauXe(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "mauXeId,asc") String sort) {
        // Xử lý sắp xếp
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction sortDirection = Sort.Direction.fromString(sortParams[1]);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

        Page<MauXeResponse> mauXePage = mauXeService.getAllMauXe(pageable);

        return ApiResponse.<Page<MauXeResponse>>builder()
                .message("Lấy danh sách mẫu xe thành công")
                .data(mauXePage)
                .build();
    }
    @GetMapping("/getmauxe/{mauxeid}")
    public ApiResponse<MauXeResponse> getMauXeById(@PathVariable int mauxeid) {
        return ApiResponse.<MauXeResponse>builder()
                .message("Lấy thông tin mẫu xe thành công")
                .data(mauXeService.getMauXeById(mauxeid))
                .build();
    }
    @DeleteMapping("/deletemauxe/{mauxeid}")
    public ApiResponse<String> deleteMauXe(@PathVariable int mauxeid) {
        mauXeService.deleteMauXe(mauxeid);
        return ApiResponse.<String>builder()
                .message("Xóa mẫu xe thành công")
                .data("Mẫu xe với ID " + mauxeid + " đã được xóa.")
                .build();
    }
    @PutMapping("/updatemauxe/{mauxeid}")
    public ApiResponse<MauXeResponse> updateMauXe(@PathVariable int mauxeid, @ModelAttribute MauXeRequest request) {
        MauXeResponse mauXeResponse = mauXeService.updateMauXe(mauxeid, request);
        return ApiResponse.<MauXeResponse>builder()
                .message("Cập nhật mẫu xe thành công")
                .data(mauXeResponse)
                .build();
    }
    @PostMapping(value = "/addnewmauxe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<MauXeResponse> createMauXe(@ModelAttribute MauXeRequest request) throws IOException {
        MauXeResponse mauXeResponse = mauXeService.createMauXe(request);
        return ApiResponse.<MauXeResponse>builder()
                .message("Thêm mẫu xe thành công")
                .data(mauXeResponse)
                .build();
    }
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("src/main/resources/static/images/" + filename);
            System.out.println("File path: " + filePath);
            Resource resource = new UrlResource(filePath.toUri());
            System.out.println("Resource exists: " + resource.exists());
            System.out.println("Resource readable: " + resource.isReadable());
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch ( IOException e) {
            throw new RuntimeException("Lỗi khi lấy ảnh", e);
        }
    }
    //api get all mau xe theo loai xe
    @GetMapping("/getmauxetheoloaixe/{loaixeId}")
    public ApiResponse<Page<MauXeResponse>> getMauXeByLoaiXe(
            @PathVariable int loaixeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "mauXeId,asc") String sort) {
        // Xử lý sắp xếp
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction sortDirection = Sort.Direction.fromString(sortParams[1]);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

        Page<MauXeResponse> mauXePage = mauXeService.getMauXeByLoaiXe(loaixeId, pageable);

        return ApiResponse.<Page<MauXeResponse>>builder()
                .message("Lấy danh sách mẫu xe theo loại xe thành công")
                .data(mauXePage)
                .build();
    }
    /**
     * Tìm kiếm mẫu xe theo tên, loại xe và hãng xe với phân trang.
     *
     * @param tenMau Tên mẫu xe (tùy chọn, tìm kiếm gần đúng).
     * @param loaiXeId ID của loại xe (tùy chọn).
     * @param hangXeId ID của hãng xe (tùy chọn).
     * @param page Trang hiện tại (mặc định 0).
     * @param size Số bản ghi mỗi trang (mặc định 10).
     * @param sort Trường và hướng sắp xếp (mặc định "mauXeId,asc").
     * @return ApiResponse chứa danh sách mẫu xe phân trang.
     */
    @GetMapping("/search")
    public ApiResponse<Page<MauXeResponse>> searchMauXe(
            @RequestParam(required = false) String tenMau,
            @RequestParam(required = false) Integer loaiXeId,
            @RequestParam(required = false) Integer hangXeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "mauXeId,asc") String sort) {
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        Sort.Direction sortDirection = Sort.Direction.fromString(sortParams[1]);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortField));

        Page<MauXeResponse> mauXePage = mauXeService.searchMauXe(tenMau, loaiXeId, hangXeId, pageable);

        return ApiResponse.<Page<MauXeResponse>>builder()
                .message("Tìm kiếm mẫu xe thành công"+
                        " với tên: " + tenMau +
                        ", loại xe ID: " + loaiXeId +
                        ", hãng xe ID: " + hangXeId)
                .data(mauXePage)
                .build();
    }
    //lay10 xe nhieuf luowjt dat nhat
    @GetMapping("/gettop10mauxe")
    public ApiResponse<List<MauXeResponse>> getTop10MauXeBySoLuotDat(
            @RequestParam(required = false) Integer loaiXeId) {
        List<MauXeResponse> topMauXeList = mauXeService.getTop10MauXeBySoLuotDat(loaiXeId);
        return ApiResponse.<List<MauXeResponse>>builder()
                .success(true)
                .message("Lấy top 10 mẫu xe có số lượt đặt nhiều nhất thành công")
                .data(topMauXeList)
                .build();
    }
    //upload anh by mauxeId
    @GetMapping("")

    @PostMapping("/upload")
    public ApiResponse<List<AnhXe>> uploadImages(
            @RequestParam("mauXeId") Integer mauXeId,
            @RequestParam("files") List<MultipartFile> files) {
        try {
            //print hello word

            if (files == null || files.isEmpty()) {
                throw new IllegalArgumentException("Vui lòng gửi ít nhất một file ảnh");
            }
              // in ra helo

            List<AnhXe> uploadedImages = mauXeService.uploadImages(mauXeId, files);
            return ApiResponse.<List<AnhXe>>builder()
                    .success(true)
                    .message("Upload ảnh thành công")
                    .data(uploadedImages)
                    .build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu file: " + e.getMessage());
        }
    }
    @GetMapping("/getallloaixe")
    public ApiResponse<List<LoaiXe>>getall()
    {
        return ApiResponse.<List<LoaiXe>>builder()
                .message("Lấy tất xe thành cong")
                .success(true)
                .data(mauXeService.getallLoaiXe())
                .build();
    }
    @GetMapping("/getallhangxe")
    public ApiResponse<List<HangXe>>getallhx(){
        return ApiResponse.<List<HangXe>>builder()
                .message("lay thanh con")
                .success(true)
                .data(mauXeService.getallhangxe())
                .build();
    }
    //viet api lay mau xe theo hang xe



}