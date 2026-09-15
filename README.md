# Portfolio Hub — Full-Stack MERN Portfolio Application

Portfolio Hub is a modern, production-ready Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to showcase software development projects, accept direct client inquiries, and manage dynamic content via a secure, role-based Admin Panel.

🌐 Live Application: https://raji-dev.nl  
🔗 API Health Check: https://portfolio-backend-api-h2pz.onrender.com/api/health

---

## Key Features

### Public Client Features
- **Hero Section & Bio**: Highlighting professional skills, full-stack overview, and interactive email clipboard button with instant feedback.
- **3D Perspective Project Cards**: Interactive cards featuring cursor-following glow effects, dynamic 3D tilt responsiveness, and intelligent action buttons adapting to project types (Live Apps, Interactive GIFs, or pure Code Modules).
- **Dedicated Portfolio Showcase**: Advanced exact-match category filtering and real-time keyword search engine organizing chronological milestones across specialized tech stacks without bleed-over.
- **Flexible Grid/List View & Deep Link Sharing**: Interactive layout toggle between 3D Grid cards and detailed List rows, featuring direct custom domain deep-linking (`raji-dev.nl/portfolio#project-id`) with Open Graph social preview meta tags.
- **Interactive Skills Badges**: Real-time database-synced skill badges displaying dynamic project counters and category highlights.
- **Interactive Contact Experience**: Dedicated contact page featuring direct messaging, contact info cards, ambient backdrop glows, and a 3D flying paper plane success animation.
- **Dynamic SEO & Metadata Manager**: Route-aware metadata controller (`PageSEO`) updating document titles and Open Graph parameters dynamically during single-page navigation.
- **Multi-Page Routing System & Smooth Navigation**: Clean page navigation via React Router (`/`, `/about`, `/portfolio`, `/contact`) featuring dynamic active route indicators, automatic ScrollToTop restoration on page changes, and a fully responsive animated mobile navigation menu.
- **Modern UI & Responsive Design**: Built using React 19, Framer Motion, Tailwind CSS v4, and Lucide React icons.

### Admin Portal & Security
- **Lamp Toggle Login Gate**: Interactive Lamp pull-string switch with spring physics, custom Web Audio click feedback, Caps Lock detection, passcode visibility toggle, and adaptive layout scaling for all device viewports.
- **JWT Authentication**: Stateful user authentication backed by secure HTTP-Only Cookies with cross-origin credential passing.
- **Strict Role-Based Guard**: Restricts `/admin` access strictly to authorized administrators via cookie inspection (`protect` & `adminOnly` middleware).
- **NoSQL Injection Sanitization**: Middleware integration utilizing `express-mongo-sanitize` to strip unvalidated operator payloads across incoming request bodies and parameters.
- **Granular Rate Limiting**: Dual-tier rate limiting with a dedicated 5-attempt threshold per 15 minutes on `/api/auth/login` to prevent credential stuffing, paired with a global API limiter.
- **Anti-Spam Honeypot Guard**: Client-side hidden field trap paired with server-side validation to intercept automated spam submissions silently without requiring intrusive captchas.
- **Advanced Dashboard Engine**: 
  * Features real-time category filtering, lightweight rendering, instant manual refresh capability, and smart pagination for large project datasets.
  * Preview Modal Architecture protecting destructive actions (edit/delete) behind explicit view interactions.
- **Draft Management & IDOR Hardening**: Toggle project visibility between public showcase (`isPublished: true`) and internal draft state (`isPublished: false`) with strict server-side queries preventing unauthorized draft exposure.
- **Full Dynamic Content Management (CRUD)**:
  * **Create**: Add new projects with dynamic tech stack chips and multi-destination URLs (Live Demo, GIF Media, Sub-path Folder, and Root Repo).
  * **Read**: Fetch live projects and draft entries dynamically from MongoDB Atlas.
  * **Update**: Edit existing project details instantly via pre-filled admin modals.
  * **Delete**: Remove outdated projects with custom confirmation modal guards.
- **Advanced Inbox & Bulk Operations**:
  * Categorized message filtering (All, Unread, Starred Favorites).
  * Individual message starring and read status toggling.
  * High-performance Bulk Actions (Bulk Delete & Bulk Mark as Read) using optimized MongoDB queries.

---

## Tech Stack & Architecture

- **Frontend**: React 19, Vite (Rolldown engine with chunk splitting), React Router DOM v7, Framer Motion, Axios, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express.js (v5), RESTful API Architecture
- **Database**: MongoDB Atlas & Mongoose ODM
- **Security**: JSON Web Tokens (JWT), Bcrypt.js, HTTP-Only Cookies, Helmet.js, Express Mongo Sanitize, Express Rate Limit, Anti-Spam Honeypot, Strict CORS
- **Performance Optimization**: Route-level code splitting via `React.lazy` / `Suspense` and manual vendor chunking reducing initial bundle size to improve Lighthouse scores.
- **Deployment & Hosting**:
  * Frontend: Vercel (Production Build with Custom SSL Domain: `raji-dev.nl`)
  * Backend: Render (Frankfurt Region) with reverse proxy trust configuration
  * Uptime Monitoring: Integrated ping health checks to eliminate cold starts
- **Version Control**: Git, GitHub (Feature Branching Workflow)

---

## Repository Structure

```text
portfolio-hub-mern/
├── backend/                  # Express API Server & Database Logic
│   ├── config/               # Database Connection Configuration
│   ├── controllers/          # Request Handlers & Business Logic
│   ├── middlewares/          # JWT Protect Guard & Error Handling
│   ├── models/               # Mongoose Schemas (User, Project, Message)
│   ├── routes/               # API Route Endpoints
│   ├── utils/                # Seeder Utilities (seedAdminUser)
│   ├── seeder.js             # Standalone Data Population Script
│   └── server.js             # Application Entry Point
│
├── client/                   # Vite React Frontend
│   ├── src/
│   │   ├── api/              # Axios Centralized Client (withCredentials: true)
│   │   ├── components/       # Reusable UI Components & PageSEO
│   │   ├── context/          # Auth Context Provider
│   │   ├── pages/            # View Pages (LoginPage, AdminDashboard)
│   │   └── App.jsx           # Main Router & Dynamic Code-Splitting
│   └── package.json
│
└── README.md                 # Project Documentation
```
---

## Local Development Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone Repository
git clone https://github.com/rajyabdullah-spec/portfolio-hub-mern.git
cd portfolio-hub-mern

### 2. Backend Configuration
Navigate to backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_hub
JWT_SECRET=super_secret_jwt_key_2026_capstone
ADMIN_EMAIL=admin@domain.com
ADMIN_PASSWORD=your_secure_password
JWT_EXPIRE=24h
JWT_COOKIE_EXPIRE=1
CLIENT_URL=http://localhost:5173
```

Populate initial project records (Optional):
```bash
node seeder
```

Run Express Backend Server:
```bash
npm run dev
```

### 3. Frontend Configuration
Open a new terminal, navigate to the `client/` directory and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Run Vite React Frontend:
```bash
npm run dev
```

---

## API Route Specifications

- GET /api/health — Public — System health check & uptime monitor endpoint
- POST /api/auth/register — Public — Registers a new user account
- POST /api/auth/login — Public — Authenticates admin & sets secure HTTP-Only Cookie
- GET /api/auth/me — Private — Verifies current active user session
- POST /api/auth/logout — Private / Public — Clears authentication cookie
- GET /api/projects — Public — Fetches published portfolio items chronologically
- GET /api/projects/:id — Public — Fetches a single published project by ID
- GET /api/projects/admin — Private (Admin) — Fetches all portfolio items including draft entries
- POST /api/projects — Private (Admin) — Creates a new project entry
- PUT /api/projects/:id — Private (Admin) — Updates an existing project by ID
- DELETE /api/projects/:id — Private (Admin) — Deletes a project by ID
- POST /api/messages — Public — Submits contact message to database (Protected with Honeypot)
- GET /api/messages — Private (Admin) — Retrieves all user contact inquiries
- PUT /api/messages/:id/read — Private (Admin) — Marks a contact message as read
- PUT /api/messages/:id/star — Private (Admin) — Toggles starred/favorite status of a message
- DELETE /api/messages/:id — Private (Admin) — Deletes a contact message by ID
- POST /api/messages/bulk-delete — Private (Admin) — Simultaneously deletes multiple selected messages
- POST /api/messages/bulk-read — Private (Admin) — Simultaneously marks multiple selected messages as read

---

## License
Distributed under the MIT License. See LICENSE for more information.

---

## Developed By
Raji Al-Abdullah — Full-Stack Software Developer  
🌐 Website: https://raji-dev.nl