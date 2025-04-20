package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Request.DonDatXeRequest;
import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.DonDatXeResponse;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Service.DonDatXeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dondatxe")

public class DonDatXeController {
    @Autowired
    private DonDatXeService donDatXeService;
    //lấy tất cả đơn đặt xe
    @GetMapping("/getalldon")
    public List<DonDatXeResponse> getAllDonDatXe() {
        return donDatXeService.getallDOnDatXe();
    }
    // lấy đơn đặt xe theo id
    @GetMapping("/getdon/{id}")
    public DonDatXeResponse getDonDatXeById(@PathVariable int  id) {
        return donDatXeService.getDonDatXeById(id);
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
}
