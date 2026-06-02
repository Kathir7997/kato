# KatoShort — URL Shortener & Analytics Platform

> A production-ready, hackathon-quality URL Shortener SaaS platform with real-time analytics, QR code generation, bulk upload, and a premium dashboard UI.

![KatoShort Banner](https://img.shields.io/badge/KatoShort-URL%20Shortener-6366f1?style=for-the-badge&logo=link&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwind-css)

---

## 📖 Project Overview

KatoShort is a full-stack SaaS URL Shortener with a comprehensive analytics dashboard. Users can register, create short URLs with optional custom aliases and expiry dates, track every click in real time, view charts, generate QR codes, and bulk-shorten URLs from a CSV file.

The project is designed to be **interview-ready**, **deployment-ready**, and **visually impressive** — inspired by dashboards like Vercel, Linear, and Stripe.

---

## ✨ Features

### 🔐 Authentication
- JWT-based registration and login
- bcrypt password hashing
- Protected routes with middleware authorization
- Persistent sessions via localStorage
- Password strength meter on registration

### 🔗 URL Management
- Create short URLs from any valid HTTP/HTTPS URL
- Custom alias support (3–30 chars)
- Optional expiry date per URL
- Auto-generated 6-character short codes (nanoid)
- Copy to clipboard with one click
- Edit and delete URLs
- Pagination, search, sorting, and status filters

### 📊 Analytics
- Per-URL analytics page with:
  - Total Clicks, Unique Visitors, Last Visit, Avg Clicks/Day
  - Daily click trend (line chart — last 30 days)
  - Device distribution (pie chart)
  - Browser distribution (pie chart)
  - Top 10 countries (horizontal bar chart)
  - Recent visits table (date, time, browser, device, OS, country, city)
- Visitor tracking: IP, browser, device, OS, country, city

### 📱 QR Code
- Auto-generated QR code for every URL
- Modal viewer with download as PNG

### 🌐 Public Stats Page
- `/stats/:shortCode` — accessible without authentication
- Shows click count, creation date, last visit, QR code
- Expired link detection

### 📁 Bulk Upload
- CSV drag-and-drop uploader
- Columns: OriginalURL, CustomAlias, ExpiryDate
- Row-by-row validation and error reporting
- Success/failure summary

### 🎨 UI/UX
- Collapsible sidebar with animated transitions (Framer Motion)
- Loading skeletons for all data-fetching states
- Empty states with guidance
- Toast notifications (React Hot Toast)
- Confirmation modals for destructive actions
- Responsive layout (mobile-friendly)
- Glassmorphism card effects
- Indigo/Purple color palette

---

## 🗺️ Planning Document

### Phase 1: Backend Foundation
- Initialize Node.js/Express with clean MVC architecture
- MongoDB Atlas connection via Mongoose
- JWT authentication system
- URL CRUD with validation and QR code generation
- Analytics aggregations (daily trend, device, browser, country)
- Public redirect with visitor tracking

### Phase 2: Frontend Foundation
- Vite + React project setup
- Tailwind CSS v4 configuration
- Axios API service layer with interceptors
- React Query for server-state caching
- Auth context and protected routes

### Phase 3: Pages & Components
- Login, Register (with password strength meter)
- Dashboard (stats cards, URL table, search/filter/sort)
- Analytics (4 Recharts charts, visit table)
- Bulk Upload (drag-and-drop dropzone)
- Public Stats Page (no auth)
- Modals: QR, Edit, Delete Confirm

### Phase 4: Polish & Deployment
- Loading skeletons, empty states, error states
- Framer Motion animations throughout
- README, deployment configs

---

## 🏗️ Architecture Design

```
┌──────────────────────────────────────────────────────┐
│                  React Frontend (Vite)                │
│  Pages: Login, Register, Dashboard, Analytics,        │
│         BulkUpload, PublicStats, NotFound             │
│  State: React Query + AuthContext                     │
│  HTTP:  Axios (JWT Bearer token injection)            │
└──────────────────┬───────────────────────────────────┘
                   │ REST API
┌──────────────────▼───────────────────────────────────┐
│               Node.js / Express Backend               │
│  Routes:  /api/auth  /api/url  /api/analytics         │
│           /api/user  /api/public  /:shortCode         │
│  Middlewares: protect (JWT), errorHandler             │
│  Services: nanoid, qrcode, geoip-lite, ua-parser-js  │
└──────────────────┬───────────────────────────────────┘
                   │ Mongoose ODM
┌──────────────────▼───────────────────────────────────┐
│                 MongoDB Atlas                         │
│  Collections: users, urls, visits                    │
└──────────────────────────────────────────────────────┘
```

---

## 🗃️ Database Schema

### User
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required, max 60 |
| `email` | String | Required, unique, lowercase |
| `password` | String | bcrypt hashed, select: false |
| `createdAt` | Date | Mongoose timestamps |

### Url
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | Ref: User |
| `originalUrl` | String | Required |
| `shortCode` | String | Unique, nanoid(6) |
| `customAlias` | String | Optional, nullable |
| `qrCode` | String | Base64 data URI |
| `clickCount` | Number | Default: 0 |
| `expiryDate` | Date | Optional, nullable |
| `createdAt` | Date | Mongoose timestamps |
| `isExpired` | Virtual | Computed from expiryDate |

### Visit
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `urlId` | ObjectId | Ref: Url |
| `timestamp` | Date | Default: now |
| `browser` | String | ua-parser-js |
| `device` | String | Mobile/Tablet/Desktop |
| `os` | String | ua-parser-js |
| `ip` | String | From request headers |
| `country` | String | geoip-lite lookup |
| `city` | String | geoip-lite lookup |

---

## 📡 API Documentation

### Authentication
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create new account |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/user/profile` | Private | Get logged-in user |

### URL Management
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/url/create` | Private | Create short URL |
| GET | `/api/url` | Private | Get all user URLs (search, filter, sort, paginate) |
| GET | `/api/url/:id` | Private | Get single URL |
| PUT | `/api/url/:id` | Private | Update URL |
| DELETE | `/api/url/:id` | Private | Delete URL + visits |
| POST | `/api/url/bulk-upload` | Private | Bulk CSV upload |

### Analytics
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/:id` | Private | Full analytics for URL |

### Public
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/:shortCode` | Public | Redirect to original URL |
| GET | `/api/public/stats/:shortCode` | Public | Public stats data |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/katoshort.git
cd katoshort
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000
npm run dev
```

### 4. Open in Browser
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/health

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/katoshort
JWT_SECRET=your_32_char_secret_here
JWT_EXPIRE=30d
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_BASE_URL=http://localhost:5000
```

---

## 💡 Assumptions

1. **Authentication is session-based using localStorage** — no refresh token mechanism (suitable for hackathon scope).
2. **Geolocation** uses the free `geoip-lite` offline database — accuracy may vary, and localhost IPs are mapped to a Google IP for demo purposes.
3. **QR codes** are stored as base64 data URIs in MongoDB — suitable for medium-scale usage. For production at scale, consider storing in an S3 bucket.
4. **Expiry enforcement** is done at redirect time (server-side) and at display time (client-side virtual) — there is no background job to auto-deactivate URLs.
5. **Bulk upload** is limited to 5MB CSV files. Very large files should use a streaming upload approach.

---

## 🔮 Future Enhancements

- [ ] OAuth2 social login (Google, GitHub)
- [ ] URL password protection
- [ ] Link preview customization (Open Graph tags)
- [ ] Webhook support for click events
- [ ] Team/workspace support for multiple users
- [ ] Rate limiting per user
- [ ] Background job for expired URL cleanup (Bull queue)
- [ ] Email notifications for link expiry
- [ ] Advanced analytics: heatmaps, funnel tracking
- [ ] API key support for programmatic access
- [ ] White-label custom domains

---

## 🚢 Deployment Steps

### Backend → Render
1. Push `backend/` to GitHub
2. Connect repo to [Render](https://render.com)
3. Set environment variables in Render dashboard
4. Build command: `npm install`
5. Start command: `node server.js`
6. Note your Render URL (e.g., `https://katoshort-api.onrender.com`)

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set `VITE_API_URL` and `VITE_BASE_URL` to your Render backend URL
4. Vercel auto-detects Vite and deploys
5. The included `vercel.json` handles SPA routing

---

## 📸 Screenshots

> _Screenshots coming after deployment_

| Dashboard | Analytics | Public Stats |
|---|---|---|
| ![Dashboard](./screenshots/dashboard.png) | ![Analytics](./screenshots/analytics.png) | ![Stats](./screenshots/stats.png) |

---

## 🎬 Demo Video

> _Loom/YouTube walkthrough link coming soon_

---

## 🗂️ Project Structure

```
katoshort/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── urlController.js
│   │   │   ├── analyticsController.js
│   │   │   └── publicController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Url.js
│   │   │   └── Visit.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── user.js
│   │   │   ├── url.js
│   │   │   ├── analytics.js
│   │   │   └── public.js
│   │   ├── services/
│   │   │   ├── shortCodeService.js
│   │   │   ├── qrService.js
│   │   │   └── geoService.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── generateToken.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── render.yaml
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── StatsCard.jsx
    │   │   │   ├── CreateUrlForm.jsx
    │   │   │   └── UrlTable.jsx
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Navbar.jsx
    │   │   ├── shared/
    │   │   │   ├── QRModal.jsx
    │   │   │   ├── EditUrlModal.jsx
    │   │   │   └── ConfirmModal.jsx
    │   │   └── ui/
    │   │       ├── Button.jsx
    │   │       ├── Input.jsx
    │   │       ├── Badge.jsx
    │   │       ├── Modal.jsx
    │   │       ├── Skeleton.jsx
    │   │       └── EmptyState.jsx
    │   ├── context/AuthContext.jsx
    │   ├── layouts/AppLayout.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── AnalyticsPage.jsx
    │   │   ├── BulkUploadPage.jsx
    │   │   ├── PublicStatsPage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── services/api.js
    │   ├── utils/helpers.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── vercel.json
    ├── .env
    ├── .env.example
    └── package.json
```

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Routing | React Router v6 |
| State | React Query (TanStack) |
| Animations | Framer Motion |
| Charts | Recharts |
| HTTP | Axios |
| Notifications | React Hot Toast |
| File Upload | React Dropzone |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT, bcryptjs |
| Short Codes | nanoid |
| QR Codes | qrcode |
| Geolocation | geoip-lite |
| UA Parsing | ua-parser-js |
| CSV Parsing | csv-parse |
| File Upload | multer |

---

This project is a part of a hackathon run by https://katomaran.com
