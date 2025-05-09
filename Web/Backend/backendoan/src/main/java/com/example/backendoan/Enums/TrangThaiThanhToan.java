package com.example.backendoan.Enums;

public enum TrangThaiThanhToan {
    CHUA_THANH_TOAN(0),
    DA_THANH_TOAN(1);

    private final int value;

    TrangThaiThanhToan(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
