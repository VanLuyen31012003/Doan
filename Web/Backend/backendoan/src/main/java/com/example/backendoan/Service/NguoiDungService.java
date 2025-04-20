package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.NguoiDungRequest;
import com.example.backendoan.Dto.Response.NguoiDungResponse;
import com.example.backendoan.Entity.NguoiDung;
import com.example.backendoan.Repository.NguoiDungRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class NguoiDungService {
    @Autowired
    NguoiDungRepository nguoiDungRepository;
    @PreAuthorize("hasRole('ADMIN')")
    public List<NguoiDungResponse> getallnguoi_dung(){
        log.info("Inmethod get Users:");
        return nguoiDungRepository.findAll().stream().map(nguoiDung ->
                new NguoiDungResponse(nguoiDung.getHo_ten(),
                        nguoiDung.getEmail(),
                        nguoiDung.getMat_khau(),
                        nguoiDung.getVai_tro())).collect(Collectors.toList());
    }
    @PostAuthorize("returnObject.email== authentication.name or hasRole('ADMIN')" )
    public NguoiDungResponse getnguoi_dung(int id){
        NguoiDung nguoiDung = nguoiDungRepository.findById(id);
        return  NguoiDungResponse.builder().ho_ten(nguoiDung.getHo_ten())
                .email(nguoiDung.getEmail())
                .mat_khau(nguoiDung.getMat_khau())
                .vai_tro(nguoiDung.getVai_tro())
                .build();
    }
    public NguoiDungResponse addnguoidung(NguoiDungRequest nguoiDung){
        NguoiDung nguoi = NguoiDung.builder().vai_tro(nguoiDung.getVai_tro())
                .ho_ten(nguoiDung.getHo_ten())
                .email(nguoiDung.getEmail())
                .mat_khau(nguoiDung.getMat_khau())
                .build();
        NguoiDung  nguoiDung1=  nguoiDungRepository.save(nguoi);
        return  NguoiDungResponse.builder().vai_tro(nguoiDung1.getVai_tro()).
                email(nguoiDung1.getEmail()).
                mat_khau(nguoiDung1.getMat_khau()).
                ho_ten(nguoiDung1.getHo_ten()).
                build();
    }
    public NguoiDungResponse getMyinfo(){
        var context= SecurityContextHolder.getContext();
        String name=context.getAuthentication().getName();
        Optional<NguoiDung> email =nguoiDungRepository.findByEmail(name);
        NguoiDung nguoiDung = email.orElseThrow(() ->
                new RuntimeException("Không tìm thấy người dùng với email: " + name));
        return  NguoiDungResponse.builder()
                .ho_ten(nguoiDung.getHo_ten())
                .email(nguoiDung.getEmail())
                .mat_khau(nguoiDung.getMat_khau()) // nếu không muốn trả về password thì bỏ dòng này
                .vai_tro(nguoiDung.getVai_tro())
                .build();
    }
}
