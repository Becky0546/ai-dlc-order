# API Test (curl)

Base URL: `http://localhost:8080`

---

## 1. Auth

### 관리자 로그인
```bash
curl -s -X POST http://localhost:8080/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"STORE01","username":"admin","password":"1234"}'
```

### 테이블 디바이스 로그인
```bash
curl -s -X POST http://localhost:8080/api/v1/auth/table/login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"STORE01","tableNumber":1,"tablePassword":"0000"}'
```

### 로그인 실패 (잘못된 비밀번호)
```bash
curl -s -X POST http://localhost:8080/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"storeCode":"STORE01","username":"admin","password":"wrong"}'
```

---

## 2. Categories

### 카테고리 목록 조회
```bash
curl -s http://localhost:8080/api/v1/categories
```

---

## 3. Menus

### 전체 메뉴 조회
```bash
curl -s http://localhost:8080/api/v1/menus
```

### 카테고리별 메뉴 조회
```bash
curl -s "http://localhost:8080/api/v1/menus?categoryId=1"
```
