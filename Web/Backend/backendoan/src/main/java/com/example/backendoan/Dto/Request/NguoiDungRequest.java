package com.example.backendoan.Dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NguoiDungRequest {
    String  ho_ten ;
    String  email ;
    String  mat_khau ;
    Integer vai_tro;
}
