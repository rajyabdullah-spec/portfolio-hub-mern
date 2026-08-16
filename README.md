# Portfolio Hub — Full-Stack MERN Portfolio Application

Portfolio Hub is a modern, production-ready Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to showcase software development projects, accept direct client inquiries, and manage dynamic content via a secure, role-based Admin Panel.

🌐 **Live Application:** https://raji-dev.nl
🔗 **API Health Check:** https://portfolio-backend-api-h2pz.onrender.com/api/health

---

## Key Features

### Public Client Features
- **Hero Section & Bio:** Highlighting professional skills, full-stack overview, and interactive email clipboard button with instant feedback.
- **3D Perspective Project Cards:** Interactive cards featuring cursor-following glow effects, dynamic 3D tilt responsiveness, and intelligent action buttons adapting to project types (Live Apps, Interactive GIFs, or pure Code Modules).
- **Dedicated Portfolio Showcase:** Advanced exact-match category filtering and real-time keyword search engine organizing 76 chronological milestones across specialized tech stacks without bleed-over.
- **Interactive Skills Badges:** Real-time database-synced skill badges displaying dynamic project counters and category highlights.
- **Interactive Contact Experience:** Dedicated contact page featuring direct messaging, contact info cards, ambient backdrop glows, and a 3D flying paper plane success animation.
- **Multi-Page Routing System:** Clean page navigation via React Router (`/`, `/about`, `/portfolio`, `/contact`) with active nav indicators.
- **Modern UI & Responsive Design:** Built using React 18, Framer Motion, Tailwind CSS v4, and Lucide React icons.

### Admin Portal & Security
- **Lamp Toggle Login Gate:** Interactive Lamp pull-string switch with spring physics, custom Web Audio click feedback, automatic email field focus, Caps Lock detection, and passcode visibility toggle.
- **JWT Authentication:** Stateful user authentication backed by secure HTTP-Only Cookies with cross-origin credential passing.
- **Protected Routes Guard:** Restricts `/admin` access strictly to authorized administrators (`protect` & `adminOnly` middleware).
- **Advanced Dashboard Engine:** 
  * Features real-time search filtering, lightweight rendering, instant manual refresh capability, and smart pagination for large project datasets.
  * Optimistic UI state updates for immediate unread-to-read inbox status switching.
- **Full Dynamic Content Management (CRUD):**
  * **Create:** Add new projects with dynamic tech stack chips, URL routing (Live Demo, GIF Media, Specific Source Folder, and Main Repo Root).
  * **Read:** Fetch live projects dynamically from MongoDB.
  * **Update:** Edit existing project details instantly via pre-filled admin modals.
  * **Delete:** Remove outdated projects with custom confirmation modal guards.
  * **Inbox Management:** Read, mark as read, reply via direct mail link, and manage client contact inquiries.

---

## Tech Stack & Architecture

- **Frontend:** React 18, Vite, React Router DOM v6, Framer Motion, Axios, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express.js, RESTful API Architecture
- **Database:** MongoDB Atlas & Mongoose ORM
- **Security:** JSON Web Tokens (JWT), Bcrypt.js, HTTP-Only Cookies, Helmet.js, Express Rate Limit, Strict CORS
- **Deployment & Hosting:**
  * **Frontend:** Vercel (Production Build with Custom SSL Domain: `raji-dev.nl`)
  * **Backend:** Render (Frankfurt Region) with `trust proxy` configuration
  * **Uptime Monitoring:** Integrated ping health checks to eliminate cold starts
- **Version Control:** Git, GitHub (Feature Branching Workflow)

---

## Repository Structure

    portfolio-hub-mern/
    ├── backend/                  # Express API Server & Database Logic
    │   ├── config/               # Database Connection Configuration
    │   ├── controllers/          # Request Handlers & Business Logic
    │   ├── middlewares/          # JWT Protect Guard & Error Handling
    │   ├── models/               # Mongoose Schemas (User, Project, Message)
    │   ├── routes/               # API Route Endpoints
    │   ├── utils/                # Seeder Scripts (seedAdminUser, importData)
    │   └── server.js             # Application Entry Point
    │
    ├── client/                   # Vite React Frontend
    │   ├── src/
    │   │   ├── api/              # Axios Centralized Client (withCredentials: true)
    │   │   ├── components/       # Reusable UI Components
    │   │   ├── context/          # Auth Context Provider
    │   │   ├── pages/            # View Pages (LoginPage, AdminDashboard)
    │   │   └── App.jsx           # Main Router Setup
    │   └── package.json
    │
    └── README.md                 # Documentation

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
    cd backend
    npm install

Create a `.env` file inside the backend folder:
    PORT=5000
    NODE_ENV=development
    MONGO_URI=mongodb://127.0.0.1:27017/portfolio_hub
    JWT_SECRET=super_secret_jwt_key_2026_capstone
    ADMIN_EMAIL=admin@domain.com
    ADMIN_PASSWORD=your_secure_password
    JWT_EXPIRE=24h
    JWT_COOKIE_EXPIRE=1
    CLIENT_URL=http://localhost:5173

Seed initial Admin user and default projects (Optional):
    npm run seed

Run Express Backend Server:
    npm run dev

### 3. Frontend Configuration
Open a new terminal, navigate to the client directory and install dependencies:
    cd client
    npm install

Create a `.env` file inside the client folder:
    VITE_API_URL=http://localhost:5000/api

Run Vite React Frontend:
    npm run dev

The application will be accessible at `http://localhost:5173`.

---

## API Route Specifications

- `GET /api/health` — Public — System health check & uptime monitor endpoint
- `POST /api/auth/login` — Public — Authenticates admin & sets HTTP-Only Cookie
- `GET /api/auth/me` — Private — Verifies current active user session
- `POST /api/auth/logout` — Private — Clears authentication cookie
- `GET /api/projects` — Public — Fetches all portfolio items chronologically
- `POST /api/projects` — Private (Admin) — Creates a new project entry
- `PUT /api/projects/:id` — Private (Admin) — Updates an existing project by ID
- `DELETE /api/projects/:id` — Private (Admin) — Deletes a project by ID
- `POST /api/messages` — Public — Submits contact message to database
- `GET /api/messages` — Private (Admin) — Retrieves all user contact inquiries
- `PUT /api/messages/:id/read` — Private (Admin) — Marks a contact message as read
- `DELETE /api/messages/:id` — Private (Admin) — Deletes a contact message by ID

---

## Developed By
**Raji Al-Abdullah** — Full-Stack Software Developer  
🌐 Website: https://raji-dev.nl