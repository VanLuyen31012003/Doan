package com.example.backendoan.Enums;

public enum TrangThaiDonDatXe {
    CHO_XAC_NHAN(0),
    DA_XAC_NHAN(1),
    HOAN_THANH(2),
    HUY(3),
    DANG_THUE(4);

    private final int value;

    TrangThaiDonDatXe(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
