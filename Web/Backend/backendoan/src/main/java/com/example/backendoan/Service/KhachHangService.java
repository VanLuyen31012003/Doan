package com.example.backendoan.Service;

import com.example.backendoan.Repository.KhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KhachHangService {
    @Autowired
    KhachHangRepository khachHangRepository;
    

}
