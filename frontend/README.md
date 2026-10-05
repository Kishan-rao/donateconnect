# ⚛️ DonateConnect Frontend

Responsive web and hybrid mobile frontend for DonateConnect built with **React 18**, **TypeScript 5.7**, **Vite 6**, **Tailwind CSS v4**, and **Capacitor 8 (Android)**.

---

## 🎨 Design System & Theme

* **Warm Organic Light Theme**: Human-centric palette designed for community warmth and high accessibility.
  * Application Background: `#FAF8F5` (Warm Pearl)
  * Surface Cards: `#FFFFFF` with soft `#E5E7EB` borders
  * Primary Text: `#111827` (Deep Charcoal)
  * Accent Purple: `#7567E8` (Community Action Brand)
  * Accent Pink: `#E36A9A` (Impact Highlights)
  * SOS Emergency Banner: `#DC2626` (Crisis Relief)
* **Mobile First**: Optimized with bottom bar navigation and safe-area padding for Capacitor Android devices.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in `frontend/`:
```properties
VITE_API_BASE_URL=http://localhost:8080/api
```
*(In native Capacitor Android mode, requests automatically route to `http://10.0.2.2:8080/api` unless overridden).*

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🏗️ Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR) |
| `npm run build` | Runs TypeScript compilation check (`tsc`) followed by optimized Vite production build |
| `npm run preview` | Locally serves the generated `dist/` production bundle |

---

## 📱 Mobile App (Capacitor Android)

To synchronize web assets to the native Android project:

```bash
# 1. Build the production web bundle
npm run build

# 2. Sync web build into Android assets
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

---

## 🗺️ Application Routes & Views

### Public Routes
* `/` — Landing page with live impact statistics and feature overview
* `/ngos` — Directory of verified NGO partners with category filters
* `/ngos/:id` — Detailed NGO profile, ratings, testimonials, and past activity
* `/impact` — Real-time community metrics & environmental CO₂ savings
* `/map` — Interactive map of donation drop-off stations and partner hubs
* `/lockers` — 24/7 Smart drop-off locker station availability
* `/blockchain-ledger` — Public immutable blockchain donation ledger
* `/circular-market` — Inter-NGO surplus item exchange marketplace
* `/login` & `/register` — Authentication with role selection and OTP verification

### Role-Protected Routes
* **Donor (`DONOR`)**:
  * `/donate/new` — Donation creation form with photo attachment upload
  * `/donations` — Personal donation history, live status progression, and tracking
  * `/donor/profile` — Donor account overview and impact summary
* **NGO (`NGO`)**:
  * `/ngo-dashboard` — Assigned donations, incoming review queue, and status updates
  * `/ngo-dashboard/inventory` — Stock levels and distribution counts
  * `/ngo-dashboard/profile` — Organization profile and verification details
* **Volunteer Logistics Driver (`VOLUNTEER`)**:
  * `/driver-dashboard` — Available pickup assignments and live status dispatch
* **Corporate Giving (`CORPORATE`)**:
  * `/csr-dashboard` — Employee CSR drives and aggregated contribution progress
* **System Admin (`ADMIN`)**:
  * `/admin` — System metrics and health overview
  * `/admin/ngos` — Partner NGO approval and management
  * `/admin/donations` — Cross-organization paginated donation audit

---

## 📁 Source Code Organization

```
frontend/src/
├── api/            # Axios API service modules (auth, donation, ngo, nextgen, etc.)
├── components/     # Reusable UI widgets, banners, modals, and navbars
├── context/        # React contexts (AuthContext, ToastContext)
├── hooks/          # Custom hooks (e.g. useHealthCheck)
├── pages/          # View route pages
├── types/          # Shared TypeScript interfaces and domain types
└── utils/          # Formatting helpers and image path resolvers
```
