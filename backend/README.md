# ☕ DonateConnect Backend

RESTful backend service for DonateConnect built with **Java 21**, **Spring Boot 3.4.2**, **Spring Security 6**, **Spring Data JPA**, and **PostgreSQL**.

---

## 🚀 Key Modules & Architecture

* **Spring Security & Stateless JWT**: Bearer token authentication with role-based access control (`DONOR`, `NGO`, `VOLUNTEER`, `CORPORATE`, `ADMIN`).
* **Dual Database Support**: Automatic fallback to isolated in-memory H2 if no external `DB_URL` is supplied; seamless connection to PostgreSQL/Neon in production.
* **Email & OTP Service**: Brevo SMTP integration (`EmailService`) for two-factor verification during registration and sensitive actions.
* **Storage Service (`LocalStorageService`)**: Secure multipart file handling under configurable `UPLOAD_DIR` with filename sanitization, UUID hashing, and path-traversal prevention.
* **Audit Trail**: Every donation state transition (`StatusHistory`) is persisted chronologically with associated timestamps.
* **Seeded Demographic Data (`DataInitializer`)**: Automatically seeds verified Indian NGO profiles (Goonj, Akshaya Patra, Pratham, HelpAge, Smile), sample users, smart locker stations, and blockchain genesis blocks.

---

## ⚙️ Environment Variables

Configure these in `backend/.env` or system environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `SERVER_PORT` | `8080` | Port for the embedded Tomcat web server |
| `DB_URL` | `jdbc:h2:mem:donateconnect...` | JDBC connection URL (PostgreSQL / Neon) |
| `DB_USERNAME` | `sa` | Database user credentials |
| `DB_PASSWORD` | *(empty)* | Database password |
| `DB_DRIVER` | `org.h2.Driver` | Driver class name (`org.postgresql.Driver` for PG) |
| `DB_PLATFORM` | `org.hibernate.dialect.H2Dialect` | Hibernate dialect (`PostgreSQLDialect` for PG) |
| `JWT_SECRET` | *(required in prod)* | 256-bit signing secret key for JWT tokens |
| `JWT_EXPIRATION_MS`| `86400000` (24h) | JWT validity duration in milliseconds |
| `BREVO_SMTP_USER` | *(none)* | Brevo SMTP relay username |
| `BREVO_SMTP_KEY` | *(none)* | Brevo SMTP API / Relay master password |
| `BREVO_SENDER_EMAIL`| `noreply@donateconnect.in`| Outbound notification sender address |
| `UPLOAD_DIR` | `uploads/` | Filesystem storage path for uploaded donation media |
| `CORS_ALLOWED_ORIGINS`| `http://localhost:5173,...`| Comma-separated list of allowed origins |

---

## 🏃 Running Locally

### With System Maven
```bash
cd backend
mvn spring-boot:run
```

### With Maven Wrapper
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

Backend will bind to `http://localhost:8080`.
Verify status via `GET http://localhost:8080/api/health`.

---

## 🧪 Automated Testing

Run the full automated test suite (includes RBAC verification, donation workflows, email mocks, and end-to-end integration tests):

```bash
mvn test -Dspring.profiles.active=test
```

The test suite runs against an isolated, self-contained H2 test profile (`application-test.properties`).

---

## 📁 Source Package Structure

```
backend/src/main/java/com/donateconnect/
├── DonateConnectApplication.java   # Spring Boot entry point
├── config/
│   ├── DatabaseHealthCheck.java    # Startup JDBC connectivity reporter
│   ├── DataInitializer.java        # Database demo data seeder
│   ├── JwtAuthenticationFilter.java# Per-request JWT validation filter
│   ├── JwtUtils.java               # Token generation, claims, and signing
│   └── SecurityConfig.java         # Security filter chain & CORS config
├── controller/                     # REST controllers
├── dto/                            # Data Transfer Objects & validation
├── entity/                         # JPA domain models & Enums
├── exception/                      # Global exception handlers
├── repository/                     # Spring Data JPA repositories
└── service/                        # Service layer interfaces & implementations
```

---

## 🐳 Docker Build

```bash
docker build -t donateconnect-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/donateconnect_db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e JWT_SECRET=ProductionSecretKey32BytesLongString123! \
  donateconnect-backend
```
