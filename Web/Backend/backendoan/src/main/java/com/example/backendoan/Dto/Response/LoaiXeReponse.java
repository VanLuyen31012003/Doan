package com.example.backendoan.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiXeReponse {
    private Integer loaixeXeid;
    private String tenLoaiXe;

}
