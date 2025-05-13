    package com.example.backendoan.Controller;

    import com.example.backendoan.Dto.Request.NguoiDungRequest;
    import com.example.backendoan.Dto.Response.ApiResponse;
    import com.example.backendoan.Dto.Response.NguoiDungResponse;
    import com.example.backendoan.Service.NguoiDungService;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.web.bind.annotation.*;
    import com.example.backendoan.Entity.NguoiDung;

    import java.util.List;

    @Slf4j
    @RestController
    @RequestMapping("/nguoidung")
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
                    .data(nguoi_dungService.getallnguoi_dung())
                    .build();
        };
        @GetMapping("/getnguoidung/{id}")
        public ApiResponse<NguoiDungResponse> getnguoidung(@PathVariable int id){
            var authen= SecurityContextHolder.getContext().getAuthentication();
            log.info("username:{}",authen.getName());
            authen.getAuthorities().forEach(grantedAuthority -> log.info("grantedAuthority:{}",grantedAuthority.getAuthority()));
            return ApiResponse.<NguoiDungResponse>builder()
                    .message("Lấy thông tin người dùng thành công")
                    .data(nguoi_dungService.getnguoi_dung(id))
                    .build();
        }
        @GetMapping("/getmyinfo")
        public ApiResponse<NguoiDungResponse> getmyinfo(){
//            var authen= SecurityContextHolder.getContext().getAuthentication();
//            log.info("username:{}",authen.getName());
//            authen.getAuthorities().forEach(grantedAuthority -> log.info("grantedAuthority:{}",grantedAuthority.getAuthority()));
            return ApiResponse.<NguoiDungResponse>builder()
                    .message("Lấy thông tin người dùng thành công")
                    .data(nguoi_dungService.getMyinfo())
                    .build();
        }
        @PostMapping("/addnguoidung")
        public ApiResponse<NguoiDungResponse> addnguoidung(@RequestBody NguoiDungRequest nguoiDungRequest){
            return ApiResponse.<NguoiDungResponse>builder()
                    .message("add thành công")
                    .data(nguoi_dungService.addnguoidung(nguoiDungRequest))
                    .build();
        }
        @DeleteMapping("/deletenguoidung/{id}")
        public ApiResponse<String> deleteNguoiDung(@PathVariable String id) {
            nguoi_dungService.deleteNguoiDung(id);
            return ApiResponse.<String>builder()
                    .message("Xóa người dùng thành công")
                    .data("Người dùng với ID " + id + " đã được xóa.")
                    .build();
        }
        @PutMapping("/updatenguoidung/{email}")
        public ApiResponse<String>updateNguoiDung(@PathVariable String email, @RequestBody NguoiDungRequest nguoiDung) {
            nguoi_dungService.updateNguoiDung(email, nguoiDung);
            return ApiResponse.<String>builder()
                    .message("Cập nhật người dùng thành công")
                    .data("Người dùng với ID " + email + " đã được cập nhật.")
                    .build();
        }



    }
