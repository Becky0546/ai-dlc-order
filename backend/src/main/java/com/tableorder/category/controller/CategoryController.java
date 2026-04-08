package com.tableorder.category.controller;

import com.tableorder.category.dto.CategoryResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private static final List<CategoryResponse> CATEGORIES = List.of(
            new CategoryResponse(1L, "메인", 0),
            new CategoryResponse(2L, "사이드", 1),
            new CategoryResponse(3L, "음료", 2)
    );

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        return ResponseEntity.ok(CATEGORIES);
    }
}
