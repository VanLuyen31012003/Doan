package com.example.backendoan.Dto.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DanhGiaRequest {
    private Integer khachHangId;
    private Integer mauXeId;
    private Integer soSao;
    private String binhLuan;
}
