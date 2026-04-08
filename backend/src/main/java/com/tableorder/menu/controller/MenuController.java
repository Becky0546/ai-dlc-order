package com.tableorder.menu.controller;

import com.tableorder.category.repository.CategoryRepository;
import com.tableorder.menu.dto.MenuOrderRequest;
import com.tableorder.menu.dto.MenuRequest;
import com.tableorder.menu.dto.MenuResponse;
import com.tableorder.menu.repository.MenuRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;
    private static final Path IMAGE_DIR = Paths.get("/tmp/menu-images");

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenus(
            @RequestParam(required = false) Long categoryId) {
        List<MenuResponse> result = categoryId == null
                ? menuRepository.findAll()
                : menuRepository.findByCategoryId(categoryId);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<MenuResponse> createMenu(@Valid @RequestBody MenuRequest request) {
        String categoryName = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "카테고리를 찾을 수 없습니다"))
                .getName();
        MenuResponse created = menuRepository.save(request.getName(), request.getPrice(),
                request.getDescription(), request.getImageUrl(),
                request.getCategoryId(), categoryName, request.getDisplayOrder());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{menuId}")
    public ResponseEntity<MenuResponse> updateMenu(@PathVariable Long menuId,
                                                   @Valid @RequestBody MenuRequest request) {
        if (!menuRepository.existsById(menuId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "메뉴를 찾을 수 없습니다");
        }
        String categoryName = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "카테고리를 찾을 수 없습니다"))
                .getName();
        return ResponseEntity.ok(menuRepository.update(menuId, request.getName(), request.getPrice(),
                request.getDescription(), request.getImageUrl(),
                request.getCategoryId(), categoryName, request.getDisplayOrder()));
    }

    @DeleteMapping("/{menuId}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long menuId) {
        if (!menuRepository.existsById(menuId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "메뉴를 찾을 수 없습니다");
        }
        menuRepository.deleteById(menuId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/order")
    public ResponseEntity<Void> updateMenuOrder(@RequestBody List<MenuOrderRequest> requests) {
        for (MenuOrderRequest req : requests) {
            menuRepository.updateDisplayOrder(req.getMenuId(), req.getDisplayOrder());
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{menuId}/image")
    public ResponseEntity<Map<String, String>> uploadMenuImage(
            @PathVariable Long menuId,
            @RequestParam("file") MultipartFile file) throws IOException {
        if (!menuRepository.existsById(menuId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "메뉴를 찾을 수 없습니다");
        }
        Files.createDirectories(IMAGE_DIR);
        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + ext;
        file.transferTo(IMAGE_DIR.resolve(filename).toFile());
        String imageUrl = "/api/v1/menus/images/" + filename;
        menuRepository.updateImageUrl(menuId, imageUrl);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
        Path file = IMAGE_DIR.resolve(filename);
        if (!Files.exists(file)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "이미지를 찾을 수 없습니다");
        }
        Resource resource = new UrlResource(file.toUri());
        String contentType = Files.probeContentType(file);
        if (contentType == null) contentType = "application/octet-stream";
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }
}
