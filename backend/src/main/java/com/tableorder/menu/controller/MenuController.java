package com.tableorder.menu.controller;

import com.tableorder.menu.dto.MenuResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController {

    private static final List<MenuResponse> MENUS = List.of(
            new MenuResponse(1L, "김치찌개", 9000, "얼큰한 김치찌개", null, 1L, "메인", 0, 4.5),
            new MenuResponse(2L, "된장찌개", 8000, "구수한 된장찌개", null, 1L, "메인", 1, 4.3),
            new MenuResponse(3L, "제육볶음", 10000, "매콤한 제육볶음", null, 1L, "메인", 2, 4.7),
            new MenuResponse(4L, "계란말이", 5000, "부드러운 계란말이", null, 2L, "사이드", 0, 4.2),
            new MenuResponse(5L, "김치전", 6000, "바삭한 김치전", null, 2L, "사이드", 1, 4.0),
            new MenuResponse(6L, "콜라", 2000, "코카콜라 355ml", null, 3L, "음료", 0, 4.0),
            new MenuResponse(7L, "사이다", 2000, "칠성사이다 355ml", null, 3L, "음료", 1, 3.8)
    );

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenus(
            @RequestParam(required = false) Long categoryId) {
        List<MenuResponse> result = categoryId == null
                ? MENUS
                : MENUS.stream().filter(m -> m.getCategoryId().equals(categoryId)).toList();
        return ResponseEntity.ok(result);
    }
}
