package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Request.AuthenRequest;
import com.example.backendoan.Dto.Request.IntrospectRequest;
import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.AuthenResponse;
import com.example.backendoan.Dto.Response.IntrospctReponse;
import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Repository.DonDatXeRepository;
import com.example.backendoan.Service.Authenservice;
import com.example.backendoan.Service.MailService;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthenController {
    @Autowired
    Authenservice authenservice;
    @Autowired
    DonDatXeRepository donDatXeRepository;
    @Autowired
    MailService mailService;
//    logibyngoidung
    @PostMapping("/login")
    ApiResponse<AuthenResponse> authenticate(@RequestBody AuthenRequest authenRequest)
    {
        var result = authenservice.authenticate(authenRequest);
        return ApiResponse.<AuthenResponse>builder()
                .data(result)
                .build();
    }
    //loginbykhachhang
    @PostMapping("/loginbykhachhang")
    ApiResponse<AuthenResponse> authenticatebykhachhang(@RequestBody AuthenRequest authenRequest)
    {
        var result = authenservice.authenticatekhach(authenRequest);
        return ApiResponse.<AuthenResponse>builder()
                .data(result)
                .build();
    }
    @PostMapping("/introspect")
    ApiResponse<IntrospctReponse> introspect(@RequestBody IntrospectRequest introspectRequest) throws ParseException, JOSEException {
        var result = authenservice.introspctReponse(introspectRequest);
        return ApiResponse.<IntrospctReponse>builder()
                .data(result)
                .build();
    }
    @GetMapping("/testmail")
    public ResponseEntity<String> sendTestEmail(
            @RequestParam("email") String email,
            @RequestParam("donDatXeId") Integer donDatXeId) {
        try {
            // Tìm đơn đặt xe theo ID
            DonDatXe donDatXe = donDatXeRepository.findById(donDatXeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt xe với ID: " + donDatXeId));

            // Lấy danh sách chi tiết đơn đặt xe
            List<ChiTietDonDatXe> chiTietDonDatXes = donDatXe.getChiTiet();

            // Gửi email xác nhận
            mailService.sendBookingConfirmationEmail(email, donDatXe, chiTietDonDatXes);

            return ResponseEntity.ok("Email xác nhận đã được gửi thành công tới: " + email);
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi gửi email: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

}
