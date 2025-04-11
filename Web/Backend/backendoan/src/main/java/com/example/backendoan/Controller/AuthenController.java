package com.example.backendoan.Controller;

import com.example.backendoan.Dto.Request.AuthenRequest;
import com.example.backendoan.Dto.Request.IntrospectRequest;
import com.example.backendoan.Dto.Response.ApiResponse;
import com.example.backendoan.Dto.Response.AuthenResponse;
import com.example.backendoan.Dto.Response.IntrospctReponse;
import com.example.backendoan.Service.Authenservice;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
public class AuthenController {
    @Autowired
    Authenservice authenservice;
    @PostMapping("/login")
    ApiResponse<AuthenResponse> authenticate(@RequestBody AuthenRequest authenRequest)
    {
        var result = authenservice.authenticate(authenRequest);
        return ApiResponse.<AuthenResponse>builder()
                .data(result)
                .build();
    }
    @PostMapping("/introspect")
    ApiResponse<IntrospctReponse> introspect(@RequestBody IntrospectRequest introspectRequest) throws ParseException, JOSEException {
        var result = authenservice.introspctReponse(introspectRequest);
        return ApiResponse.<IntrospctReponse>builder()
                .data(result)
                .build();
    }

}
