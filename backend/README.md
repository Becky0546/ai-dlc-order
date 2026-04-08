# Table Order Backend

Java 17 + Spring Boot 3.5.13

## 실행 방법

프로젝트 루트에서:

```bash
# 빌드
cd backend && ./gradlew build -x test

# 실행
cd backend && ./gradlew bootRun
```

서버가 `http://localhost:8080` 에서 시작됩니다.

## 테스트 API

```bash
curl http://localhost:8080/api/v1/health
```

## 의존성

- Spring Web
- Spring Security
- Spring Data JPA
- MySQL Connector
- Lombok
- Bean Validation

> 현재는 DB 연결 없이 실행 가능하도록 DataSource 자동 설정이 제외되어 있습니다.
