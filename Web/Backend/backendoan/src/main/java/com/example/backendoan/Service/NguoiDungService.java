package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.NguoiDungRequest;
import com.example.backendoan.Dto.Response.NguoiDungResponse;
import com.example.backendoan.Entity.NguoiDung;
import com.example.backendoan.Repository.NguoiDungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NguoiDungService {
    @Autowired
    NguoiDungRepository nguoiDungRepository;
    public List<NguoiDungResponse> getnguoi_dung(){
        return nguoiDungRepository.findAll().stream().map(nguoiDung ->
                new NguoiDungResponse(nguoiDung.getHo_ten(),
                        nguoiDung.getEmail(),
                        nguoiDung.getMat_khau(),
                        nguoiDung.getVai_tro())).collect(Collectors.toList());
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
}
