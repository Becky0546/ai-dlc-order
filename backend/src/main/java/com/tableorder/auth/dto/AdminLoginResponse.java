package com.tableorder.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminLoginResponse {
    private String token;
    private String expiresAt;
    private String storeName;
}
