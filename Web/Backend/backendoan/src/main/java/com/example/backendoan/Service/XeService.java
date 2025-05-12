package com.example.backendoan.Service;

import com.example.backendoan.Entity.HangXe;
import com.example.backendoan.Entity.LoaiXe;
import com.example.backendoan.Entity.Xe;
import com.example.backendoan.Repository.HangXeRepository;
import com.example.backendoan.Repository.LoaiXeRepository;
import com.example.backendoan.Repository.XeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class XeService {
    @Autowired
    XeRepository xeRepository;
    @Autowired
    LoaiXeRepository loaiXeRepository;
    @Autowired
    HangXeRepository hangXeRepository;
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
    //get xe by id
    public Xe getXeById(int id) {
        return xeRepository.findById(id).orElse(null);
    }
    //sua xe
    public Xe updateXe(Xe xe) {
        return xeRepository.save(xe);
    }
    //xoa xe
    public void deleteXe(int id) {
        xeRepository.deleteById(id);
    }
    //them xe
    public Xe addXe(Xe xe) {
        return xeRepository.save(xe);
    }

}
