# 🤝 DonateConnect - Production Full-Stack Platform

DonateConnect is an end-to-end community donation and surplus redistribution platform connecting donors, verified NGOs, volunteer logistics drivers, and corporate partners. 

Built with **Spring Boot 3.4.2 (Java 21)**, **PostgreSQL / H2**, **React 18**, **TypeScript**, **Vite 6**, **Tailwind CSS v4**, and **Capacitor Android**.

---

## 🚀 One-Click Launch (Windows)

Launch both backend and frontend concurrently:
```cmd
start-all.bat
```
Or start individually:
* Backend: `start-backend.bat` (starts Spring Boot on `http://localhost:8080`)
* Frontend: `start-frontend.bat` (starts Vite dev server on `http://localhost:5173`)

---

## ✨ Key Features & Capabilities

### 1. Multi-Role Ecosystem & RBAC
* **Donors**: Submit donation items (clothes, food, books, toys, stationery) with multi-photo upload, inspect real-time status progression, track driver dispatch, print tax receipts, and leave NGO reviews.
* **NGO Partners**: Review and accept incoming donations, manage item inventory, post urgent resource requirements, and trade surplus goods with peer NGOs.
* **Volunteer Drivers**: Claim pending pickups, update dispatch status (`CLAIMED` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `COMPLETED`), and view route notes.
* **Corporate CSR Wings**: Manage corporate employee giving campaigns, track collected vs. target item counts, and generate sustainability metrics.
* **System Admin**: Platform health monitor, automated/manual NGO verifications, pending account approvals, and system-wide analytics.

### 2. Next-Gen Community Modules
* **Immutable Blockchain Audit Ledger (`/blockchain-ledger`)**: Cryptographically verified audit blocks tracking item custody and handoffs from donor to NGO.
* **24/7 Smart Drop-off Locker Hubs (`/lockers`)**: Interactive network of automated metro locker hubs with live availability status.
* **Inter-NGO Surplus Marketplace (`/circular-market`)**: Circular resource exchange enabling NGOs to swap excess supplies (e.g. rice for winter wear).
* **Emergency SOS Disaster Relief Mode**: Dynamic platform-wide banner and prioritization for disaster relief drives (e.g. flood and earthquake relief).
* **Direct Coordination Messaging**: Built-in real-time comment threads attached directly to donation records between donors and NGO handlers.

### 3. Security & Architecture
* **Stateless JWT Authentication**: Secure BCrypt password hashing with 24-hour token expiration.
* **Email OTP Verification**: Integrated with Brevo SMTP for registration and login authentication.
* **Strict Ownership Validation**: Database-level queries (`findByIdAndDonorId`) preventing unauthorized data access across users.
* **Secure File Upload**: Multipart photo uploads validated against strict MIME allowlists and path-traversal safeguards.
* **Warm Organic Light Theme**: High-contrast, accessibility-first design system with mobile bottom navigation and Capacitor Android compatibility.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot 3.4.2, Spring Security 6, Spring Data JPA / Hibernate, JWT (JJWT), Maven |
| **Database** | PostgreSQL (Production/Neon) with automatic fallback to in-memory H2 for development |
| **Email / OTP** | Spring Mail with Brevo SMTP relay (`smtp-relay.brevo.com`) |
| **Frontend** | React 18, TypeScript 5.7, Vite 6, Tailwind CSS v4, Lucide React, Axios, React Hook Form, React Router DOM 7 |
| **Mobile** | Capacitor 8 (Android runtime bridge) |

---

## 🛠️ Local Development Setup

### Prerequisites
* **Java 21 JDK** installed (`java -version`)
* **Node.js 18+** & `npm` installed (`node -v`)
* **Maven 3.9+** (optional; repository includes `mvnw.cmd` / `mvnw`)

---

### Backend Setup (`backend/`)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure `.env` (optional — defaults to in-memory H2 if not provided):
   ```properties
   SERVER_PORT=8080
   DB_URL=jdbc:postgresql://localhost:5432/donateconnect_db
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=donateConnectSecretKeyMustBeAtLeast32BytesLong123!
   JWT_EXPIRATION_MS=86400000
   BREVO_SMTP_USER=your_smtp_user
   BREVO_SMTP_KEY=your_smtp_key
   BREVO_SENDER_EMAIL=noreply@donateconnect.in
   ```
3. Run the backend:
   ```bash
   mvn spring-boot:run
   ```
   *The backend starts at `http://localhost:8080`.*
   *Health endpoint: `http://localhost:8080/api/health`.*

4. Run backend automated test suite:
   ```bash
   mvn test -Dspring.profiles.active=test
   ```

---

### Frontend Setup (`frontend/`)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   ```properties
   VITE_API_BASE_URL=http://localhost:8080/api
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   *The app opens at `http://localhost:5173`.*

5. Verify TypeScript types and production build:
   ```bash
   npm run build
   ```

---

## 📱 Mobile App (Android via Capacitor)

Sync and build native Android application:
```bash
cd frontend
npm run build
npx cap sync android
npx cap open android
```

---

## 🐳 Docker Deployment

Run containerized backend:
```bash
cd backend
docker build -t donateconnect-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/donateconnect_db \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e JWT_SECRET=ProductionSecretKeyMustBe32BytesOrLonger! \
  donateconnect-backend
```

---

## 📋 Pre-Seeded Indian Demo Accounts

When the database is empty, sample demo users are automatically initialized:

| Role | Email | Password | Details |
|---|---|---|---|
| **ADMIN** | `admin@donateconnect.in` | `admin123` | System Administrator |
| **DONOR** | `priya.patel@gmail.com` | `donor123` | Active donor with sample donations |
| **DONOR** | `rahul.verma@gmail.com` | `donor123` | Verified donor with ratings |
| **NGO** | `contact@goonj.org` | `password123` | Goonj Foundation (Verified) |
| **NGO** | `info@akshayapatra.org` | `password123` | Akshaya Patra Foundation (Verified) |
| **VOLUNTEER** | `dispatch@donateconnect.in` | `driver123` | Logistics Driver Coordinator |
| **CORPORATE** | `csr@tata.com` | `corporate123` | Tata Consultancy Services CSR |

---

## 🔒 API Endpoints Overview

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Backend health check |
| `POST` | `/api/auth/register` | Public | Register donor, volunteer, or NGO |
| `POST` | `/api/auth/login` | Public | User authentication with JWT |
| `POST` | `/api/auth/verify-otp` | Public | Email OTP confirmation |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/ngo` | Public | List verified NGOs |
| `GET` | `/api/ngo/{id}` | Public | Specific NGO profile & details |
| `GET` | `/api/urgent-needs` | Public | Active emergency donation campaigns |
| `POST` | `/api/donations` | `DONOR` | Submit new donation request |
| `GET` | `/api/donations/mine` | `DONOR` | Paginated personal donations |
| `GET` | `/api/donations/mine/{id}` | `DONOR` | Single donation details & audit trail |
| `POST` | `/api/donations/photo` | `DONOR` | Upload donation photo attachment |
| `GET` | `/api/donations/photo/{name}` | Public | Serve uploaded donation images |
| `GET` | `/api/ngo/donations` | `NGO` | Donations assigned to logged-in NGO |
| `PATCH` | `/api/ngo/donations/{id}/status` | `NGO` | Update donation lifecycle status |
| `POST` | `/api/ngo/urgent-needs` | `NGO` | Post urgent item appeal |
| `GET` | `/api/volunteer/pickups` | `VOLUNTEER` | View assigned pickup tasks |
| `POST` | `/api/volunteer/pickups/{id}/claim` | `VOLUNTEER` | Claim donation pickup dispatch |
| `GET` | `/api/lockers` | Public | List 24/7 smart lockers & availability |
| `GET` | `/api/blockchain` | Public | Retrieve immutable blockchain ledger |
| `GET` | `/api/trades` | Public | Active inter-NGO surplus resource trades |
| `GET` | `/api/corporate/drives` | `CORPORATE`, `ADMIN` | Corporate CSR drives |
| `GET` | `/api/admin/stats` | `ADMIN` | Platform metrics & counts |
| `GET` | `/api/admin/ngo` | `ADMIN` | Manage NGO approval & status |
