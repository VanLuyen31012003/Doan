package com.example.backendoan.Service;

import com.example.backendoan.Dto.Request.ChiTietRequest;
import com.example.backendoan.Dto.Request.DonDatXeRequest;
import com.example.backendoan.Dto.Response.ChiTietDonDatXeReponse;
import com.example.backendoan.Dto.Response.DonDatXeResponse;
import com.example.backendoan.Entity.ChiTietDonDatXe;
import com.example.backendoan.Entity.DonDatXe;
import com.example.backendoan.Entity.MauXe;
import com.example.backendoan.Entity.Xe;
import com.example.backendoan.Enums.TrangThaiXe;
import com.example.backendoan.Repository.*;
import lombok.Builder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.naming.AuthenticationException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonDatXeService {
    @Autowired
    private DonDatXeRepository donDatXeRepository;
    @Autowired
    private NguoiDungRepository nguoiDungRepository;
    @Autowired
    private KhachHangRepository khachHangRepository;
    @Autowired
    private XeRepository xeRepository;
    @Autowired
    private MauXeRepository mauXeRepository;
    public List<Xe> findAvailableXeByMauXeId(Integer mauXeId) {
        if (mauXeId == null || mauXeId <= 0) {
            throw new IllegalArgumentException("MauXeId phải là số dương");
        }
        return xeRepository.findByMauXe_MauXeIdAndTrangThai(mauXeId, 0);
    }
    public List<ChiTietDonDatXeReponse> convertchitet(List<ChiTietDonDatXe> chiTietDonDatXes){

        return chiTietDonDatXes.stream().map(t-> ChiTietDonDatXeReponse.builder()
                .chiTietId(t.getChiTietId())
                .xe(xeRepository.findById(t.getXeId()).get())
                .soNgayThue(t.getSoNgayThue())
                .thanhTien(t.getThanhTien())
                .build()).toList();
    }
    public String convertTennguoidung(int id){
        return nguoiDungRepository.findById(id).getHo_ten();
    }
    public String converTenkhachhang(int id){
        return khachHangRepository.findById(id).get().getHoTen();
    }
    public List<DonDatXeResponse> getallDOnDatXe() {
        return donDatXeRepository.findAll().stream().map(t -> {
            Integer nguoiDungId = t.getNguoiDungId();
            String tenNguoiDung = (nguoiDungId != null) ? convertTennguoidung(nguoiDungId) : "Không xác định";
            return  DonDatXeResponse.builder ().
                    donDatXeId(t.getDonDatXeId())
                    .khachHangName(converTenkhachhang(t.getKhachHangId()))
                    .nguoiDungName(tenNguoiDung)
                    .ngayKetThuc(t.getNgayKetThuc())
                    .ngayBatDau(t.getNgayBatDau())
                    .diaDiemNhanXe(t.getDiaDiemNhanXe())
                    .tongTien(t.getTongTien())
                    .trangThai(t.getTrangThai())
                    .build();
//                    t.getDonDatXeId(),
//                    converTenkhachhang(t.getKhachHangId()),
//                    tenNguoiDung,
//                    t.getNgayBatDau(),
//                    t.getNgayKetThuc(),
//                    t.getTongTien(),
//                    t.getTrangThai(),
//                    t.getDiaDiemNhanXe(),


        }).toList();
    }
    public DonDatXeResponse getDonDatXeById(int id) {
        return donDatXeRepository.findById(id).map(t -> {
            Integer nguoiDungId = t.getNguoiDungId();
            String tenNguoiDung = (nguoiDungId != null) ? convertTennguoidung(nguoiDungId) : "Không xác định";
            return new DonDatXeResponse(
                    t.getDonDatXeId(),
                    converTenkhachhang(t.getKhachHangId()),
                    tenNguoiDung,
                    t.getNgayBatDau(),
                    t.getNgayKetThuc(),
                    t.getTongTien(),
                    t.getTrangThai(),
                    t.getDiaDiemNhanXe(),
                    convertchitet(t.getChiTiet())
            );
        }).orElse(null);
    }
    public DonDatXeResponse addDonDatXe(DonDatXeRequest donDatXe) {
        List<ChiTietDonDatXe> chiTietDonDatXes = new ArrayList<>();
        List<Integer> listXeId =new ArrayList<>();
        List<Integer> listMauxeId =new ArrayList<>();

        for (ChiTietRequest chiTietRequest : donDatXe.getChiTiet())  {
//            int s=chiTietRequest.getMauXeId();
            List<Xe> availableXeList = findAvailableXeByMauXeId(chiTietRequest.getMauXeId());
            if (availableXeList.isEmpty()) {
                for(Integer xeid : listXeId){
                    Xe xe = xeRepository.findById(xeid).get();
                    xe.setTrangThai(TrangThaiXe.CHUA_THUE.getValue());
                    xeRepository.save(xe);
                }
                // trừ lượt đặt xe cho mẫu xe
                for (Integer mauXeId : listMauxeId) {
                    MauXe mauXe = mauXeRepository.findById(mauXeId).get();
                    mauXe.setSoluotdat(mauXe.getSoluotdat() - 1);
                    mauXeRepository.save(mauXe);
                }
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Hết xe đặt cho mẫu xe: " + mauXeRepository.findById(chiTietRequest.getMauXeId()).get().getTenMau()
                );
                // trừ lượt đặt xe


            }
            //tăng số lượt đặt
            MauXe mauXe = mauXeRepository.findById(chiTietRequest.getMauXeId()).get();
            mauXe.setSoluotdat(mauXe.getSoluotdat() + 1);
            mauXeRepository.save(mauXe);
            listMauxeId.add(chiTietRequest.getMauXeId());
            Xe xe =findAvailableXeByMauXeId(chiTietRequest.getMauXeId()).get(0);
            listXeId.add(xe.getXeId());
            xe.setTrangThai(TrangThaiXe.DA_THUE.getValue());
            xeRepository.save(xe);
            ChiTietDonDatXe chiTiet = ChiTietDonDatXe.builder()
                    .xeId(xe.getXeId())
                    .soNgayThue(chiTietRequest.getSoNgayThue())
                    .thanhTien(chiTietRequest.getThanhTien())
                    .build();
            chiTietDonDatXes.add(chiTiet);
        }

        DonDatXe donDatXe1 = DonDatXe.builder()
                .khachHangId(donDatXe.getKhachHangId())
                .nguoiDungId(donDatXe.getNguoiDungId())
                .ngayBatDau(donDatXe.getNgayBatDau())
                .ngayKetThuc(donDatXe.getNgayKetThuc())
                .tongTien(donDatXe.getTongTien())
                .trangThai(donDatXe.getTrangThai())
                .diaDiemNhanXe(donDatXe.getDiaDiemNhanXe())
                .chiTiet(chiTietDonDatXes)
                .build();
        for (ChiTietDonDatXe chiTiet : chiTietDonDatXes) {
            chiTiet.setDonDatXe(donDatXe1);
        }
        DonDatXe d = donDatXeRepository.save(donDatXe1);
        return new DonDatXeResponse(
                d.getDonDatXeId(),
                converTenkhachhang(d.getKhachHangId()),
                convertTennguoidung(d.getNguoiDungId()),
                d.getNgayBatDau(),
                d.getNgayKetThuc(),
                d.getTongTien(),
                d.getTrangThai(),
                d.getDiaDiemNhanXe(),
                convertchitet(d.getChiTiet())
        );
    }
    public DonDatXeResponse updateDonDatXe(int id, DonDatXeRequest donDatXe) {
        DonDatXe donDatXe1 = donDatXeRepository.findById(id).get();


        donDatXe1.setKhachHangId(donDatXe.getKhachHangId());
        donDatXe1.setNguoiDungId(donDatXe.getNguoiDungId());
        donDatXe1.setNgayBatDau(donDatXe.getNgayBatDau());
        donDatXe1.setNgayKetThuc(donDatXe.getNgayKetThuc());
        donDatXe1.setTongTien(donDatXe.getTongTien());
        donDatXe1.setTrangThai(donDatXe.getTrangThai());
        donDatXe1.setDiaDiemNhanXe(donDatXe.getDiaDiemNhanXe());

        DonDatXe updatedDonDatXe = donDatXeRepository.save(donDatXe1);

        return new DonDatXeResponse(
                updatedDonDatXe.getDonDatXeId(),
                converTenkhachhang(updatedDonDatXe.getKhachHangId()),
                convertTennguoidung(updatedDonDatXe.getNguoiDungId()),
                updatedDonDatXe.getNgayBatDau(),
                updatedDonDatXe.getNgayKetThuc(),
                updatedDonDatXe.getTongTien(),
                updatedDonDatXe.getTrangThai(),
                updatedDonDatXe.getDiaDiemNhanXe(),
                convertchitet(updatedDonDatXe.getChiTiet())
        );

    }
    public void deleteDonDatXe(int id) {
        DonDatXe donDatXe = donDatXeRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt xe với id: " + id));
        donDatXeRepository.delete(donDatXe);
    }
    public List<DonDatXeResponse> getDonDatXeByKhachangId(Integer khachHangId) {
        nguoiDungRepository.findById(khachHangId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với id: " + khachHangId));
        List<DonDatXe> donDatXes = donDatXeRepository.findByKhachHangId(khachHangId);
        return donDatXes.stream().map(donDatXe -> DonDatXeResponse.builder()
                .donDatXeId(donDatXe.getDonDatXeId())
                .khachHangName(converTenkhachhang(donDatXe.getKhachHangId()))
                .nguoiDungName(convertTennguoidung(donDatXe.getNguoiDungId()))
                .ngayBatDau(donDatXe.getNgayBatDau())
                .ngayKetThuc(donDatXe.getNgayKetThuc())
                .tongTien(donDatXe.getTongTien())
                .trangThai(donDatXe.getTrangThai())
                .diaDiemNhanXe(donDatXe.getDiaDiemNhanXe())
//                .chiTiet(convertchitet(donDatXe.getChiTiet()))
                .build()).collect(Collectors.toList());
    }
    public List<DonDatXeResponse> getDonDatXeByToken(){
        var context= SecurityContextHolder.getContext();
        String name=context.getAuthentication().getName();
        Integer khachHangId = khachHangRepository.findByEmail(name).get().getKhachHangId();
        List<DonDatXe> donDatXes = donDatXeRepository.findByKhachHangId(khachHangId);
        return donDatXes.stream().map(donDatXe -> DonDatXeResponse.builder()
                .donDatXeId(donDatXe.getDonDatXeId())
                .khachHangName(converTenkhachhang(donDatXe.getKhachHangId()))
                .nguoiDungName(convertTennguoidung(donDatXe.getNguoiDungId()))
                .ngayBatDau(donDatXe.getNgayBatDau())
                .ngayKetThuc(donDatXe.getNgayKetThuc())
                .tongTien(donDatXe.getTongTien())
                .trangThai(donDatXe.getTrangThai())
                .diaDiemNhanXe(donDatXe.getDiaDiemNhanXe()).build()).collect(Collectors.toList());
    }
}
