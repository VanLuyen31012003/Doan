package com.example.backendoan.Dto.Response;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApiResponse<T>{
    @Builder.Default
    Boolean success = true;
    String message;
    T data;
}
