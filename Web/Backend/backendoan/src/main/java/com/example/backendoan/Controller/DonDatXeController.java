package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Request.DonDatXeRequest;
import com.example.backendoan.Dto.Request.GiaHanRequest;
import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.DonDatXeResponse;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.Xe;
import com.example.backendoan.Repository.XeRepository;
import com.example.backendoan.Service.DonDatXeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/dondatxe")

public class DonDatXeController {
    @Autowired
    private DonDatXeService donDatXeService;

    //lấy tất cả đơn đặt xe
    @GetMapping("/getalldon")
    public ApiResponse<List<DonDatXeResponse>> getAllDonDatXe() {
        return ApiResponse.<List<DonDatXeResponse>>builder()
                        .message("Lấy danh sách đơn đặt xe thành công")
                        .data(donDatXeService.getallDOnDatXe())
                        .build();
    }
    // lấy đơn đặt xe theo id
    @GetMapping("/getdon/{id}")
    public ApiResponse<DonDatXeResponse> getDonDatXeById(@PathVariable int  id) {
        return ApiResponse.<DonDatXeResponse>builder()
                        .message("Lấy đơn đặt xe thành công")
                        .data(donDatXeService.getDonDatXeById(id))
                        .build();
    }
    //  add đơn đặt xe
    @PostMapping("/adddon")
    public ApiResponse<DonDatXeResponse>  addDonDatXe(@RequestBody DonDatXeRequest donDatXe) {
        return ApiResponse.<DonDatXeResponse>builder().message("Tạo  đơn đặt xe thành công")
                        .data(donDatXeService.addDonDatXe(donDatXe))
                        .build();
    }
    // cập nhật đơn đặt xe
    @PutMapping("/updatedon/{id}")
    public ApiResponse<DonDatXeResponse> updateDonDatXe(@PathVariable int id, @RequestBody DonDatXeRequest donDatXe) {
        return ApiResponse.<DonDatXeResponse>builder().message("Cập nhật đơn đặt xe thành công")
                        .data(donDatXeService.updateDonDatXe(id, donDatXe))
                        .build();
    }
    @DeleteMapping("/deletedon/{id}")
    public ApiResponse<String> deleteDonDatXe(@PathVariable int id) {
        donDatXeService.deleteDonDatXe(id);
        return ApiResponse.<String>builder().message("Xóa đơn đặt xe thành công")
                        .data("Đơn đặt xe với ID " + id + " đã được xóa.")
                        .build();
    }
    @GetMapping("/getdonbykhachhang/{id}")
    public ApiResponse< List<DonDatXeResponse>> getDonDatXeByKhachHangId(@PathVariable int id) {

        return ApiResponse.<List<DonDatXeResponse>>builder()
                        .message("Lấy danh sách đơn đặt xe theo khách hàng thành công")
                        .data(donDatXeService.getDonDatXeByKhachangId(id))
                        .build();
    }
    @GetMapping("/getdonhangbytoken")
    public ApiResponse<List<DonDatXeResponse>> getDonDatXeByToken() {
        return ApiResponse.<List<DonDatXeResponse>>builder()
                        .message("Lấy danh sách đơn đặt xe theo token thành công")
                        .data(donDatXeService.getDonDatXeByToken())
                        .build();
    }
    @GetMapping("/layxetheomauxe/{mauXeId}")
    public ResponseEntity<List<Xe>> getAvailableXeByMauXeId(@PathVariable Integer mauXeId) {
        try {
            List<Xe> xeList = donDatXeService.findAvailableXeByMauXeId(mauXeId);
            if (xeList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(xeList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PostMapping("/giahan/{donDatXeId}")
    public ApiResponse<Double> giaHanDonDatXe(
            @PathVariable Integer donDatXeId,
            @RequestBody GiaHanRequest giaHanRequest) {
        try {
            Double tongTienGiaHan = donDatXeService.giaHanDonDatXe(donDatXeId, giaHanRequest);
            return ApiResponse.<Double>builder()
                    .success(true)
                    .message("Gia hạn thành công. Vui lòng thanh toán thêm " + tongTienGiaHan + " VNĐ khi trả xe.")
                    .data(tongTienGiaHan)
                    .build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    @GetMapping("/getdonbyidxe/{id}")
    public ApiResponse<List<DonDatXeResponse>> getDonDatXeByIdXe(@PathVariable int id) {
        return ApiResponse.<List<DonDatXeResponse>>builder()
                        .message("Lấy danh sách đơn đặt xe theo xe thành công")
                        .data(donDatXeService.getalldondatbyidxe(id))
                        .build();
    }
    @PutMapping("/updatedontoken/{id}")
    public ApiResponse<String> getDonDatXeByIdXe(@PathVariable int id, @RequestBody DonDatXeRequest donDatXeRequest) {
        return ApiResponse.<String>builder()
                .message("Huy don dat xe thanh cong")
                .data(donDatXeService.updateDonDatXenytoken(id, donDatXeRequest))
                .build();
    }
    @GetMapping("/gettongdondat")
    public long gettongdondat()
    {
        long a= donDatXeService.countalldondat();
        return a ;
    }




}

