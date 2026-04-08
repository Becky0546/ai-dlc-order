package com.tableorder.auth.service;

import com.tableorder.auth.dto.*;
import com.tableorder.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;

    // 하드코딩 관리자 계정
    private static final String ADMIN_STORE_CODE = "STORE01";
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "1234";
    private static final String STORE_NAME = "테스트 매장";

    // 하드코딩 테이블 데이터
    private record TableData(long id, int number, String name, String password) {}
    private static final Map<String, TableData[]> STORE_TABLES = Map.of(
            "STORE01", new TableData[]{
                    new TableData(1, 1, "테이블 1", "0000"),
                    new TableData(2, 2, "테이블 2", "0000"),
                    new TableData(3, 3, "테이블 3", "0000")
            }
    );

    public AdminLoginResponse adminLogin(AdminLoginRequest request) {
        if (!ADMIN_STORE_CODE.equals(request.getStoreCode())
                || !ADMIN_USERNAME.equals(request.getUsername())
                || !ADMIN_PASSWORD.equals(request.getPassword())) {
            throw new IllegalArgumentException("인증 실패");
        }

        String token = jwtUtil.generateToken(
                request.getUsername(),
                Map.of("role", "ADMIN", "storeCode", ADMIN_STORE_CODE)
        );

        String expiresAt = Instant.now().plus(1, ChronoUnit.HOURS).toString();
        return new AdminLoginResponse(token, expiresAt, STORE_NAME);
    }

    public TableLoginResponse tableLogin(TableLoginRequest request) {
        TableData[] tables = STORE_TABLES.get(request.getStoreCode());
        if (tables == null) {
            throw new IllegalArgumentException("인증 실패");
        }

        for (TableData table : tables) {
            if (table.number() == request.getTableNumber()
                    && table.password().equals(request.getTablePassword())) {
                String token = jwtUtil.generateToken(
                        "table-" + table.id(),
                        Map.of("role", "TABLE", "storeId", 1L, "tableId", table.id())
                );
                return new TableLoginResponse(token, 1L, table.id(), table.name());
            }
        }

        throw new IllegalArgumentException("인증 실패");
    }
}
