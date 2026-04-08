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
