package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.XeRequest;
import com.example.backendoan.Entity.*;
import com.example.backendoan.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class XeService {
    @Autowired
    XeRepository xeRepository;
    @Autowired
    LoaiXeRepository loaiXeRepository;
    @Autowired
    HangXeRepository hangXeRepository;
    @Autowired
    MauXeRepository mauXeRepository;
    @Autowired
    ChiTietDonDatXeRepository chiTietDonDatXeRepository;
    //get all xe
    public List<Xe> getAllXe() {
        return xeRepository.findAll();
    }
    //get all loai xe
    public List<LoaiXe> getAllLoaiXe() {
        return loaiXeRepository.findAll();
    }
    //get all hang xe
    public List<HangXe> getAllHangXe() {
        return hangXeRepository.findAll();
    }



    //sua xe
    public Xe updateXe(XeRequest xe,int id) {
        Xe xe1 =xeRepository.findById(id).orElse(null);
        if (xe1 == null) {
            throw new RuntimeException("Xe không tồn tại");
        }
        MauXe mauXe = mauXeRepository.findById(xe.getMauXeId()).orElse(null);
        if (mauXe==null)
        {
            throw new RuntimeException("Mau xe không tồn tại");
        }
        xe1.setTrangThai(xe.getTrangThai());
        xe1.setMauXe(mauXe);
        xe1.setBienSo(xe.getBienSo());
        xe1.setNgayDangKy(xe.getNgayDangKy());

        return xeRepository.save(xe1);
    }
    //xoa xe
    public void deleteXe(int id) {
        xeRepository.deleteById(id);
    }
    //them xe
    public Xe addXe(XeRequest xe) {
        MauXe mauXe = mauXeRepository.findById(xe.getMauXeId()).orElse(null);
        if(mauXe ==null)
            throw new RuntimeException("khng tìm thay mau xe") ;

        return xeRepository.save( Xe.builder()
                        .bienSo(xe.getBienSo())
                        .mauXe(mauXe)
                        .trangThai(xe.getTrangThai())
                        .ngayDangKy(xe.getNgayDangKy())
                .build());
    }
     @PreAuthorize("hasRole('ADMIN')")
    public String deleteXeById(int id) {
        xeRepository.deleteById(id);
        return "Xóa thành công";
    }
    public List<Xe> getBookedVehicles(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null && endDate == null) {
            // Trường hợp không nhập khoảng thời gian, lấy xe đang được thuê tại thời điểm hiện tại
            return chiTietDonDatXeRepository.findCurrentlyBookedVehicles();
        } else {
            // Trường hợp có khoảng thời gian, sử dụng startDate và endDate
            LocalDateTime adjustedStartDate = startDate != null ? startDate : LocalDateTime.now();
            LocalDateTime adjustedEndDate = endDate != null ? endDate : LocalDateTime.now();
            return chiTietDonDatXeRepository.findBookedVehicles(adjustedStartDate, adjustedEndDate);
        }
    }


}
