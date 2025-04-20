package com.example.backendoan.Dto.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NguoiDungRequest {
    String  ho_ten ;
    String  email ;
    String  mat_khau ;
    Set<String> vai_tro;
}
