# Portfolio Hub — Full-Stack MERN Portfolio Application

Portfolio Hub is a modern, production-ready Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to showcase software development projects, accept direct client inquiries, and manage dynamic content via a secure, role-based Admin Panel.

## Key Features

### Public Client Features
- **Hero Section & Bio:** Highlighting professional skills, full-stack overview, and interactive email clipboard button with instant feedback.
- **3D Perspective Project Cards:** Interactive cards featuring cursor-following glow effects, dynamic 3D tilt responsiveness, and intelligent action buttons adapting to project types (Live Apps, Interactive GIFs, or pure Code Modules).
- **Strict Category Filtering:** Advanced exact-match filtering algorithm to organize 70+ chronological milestones across specialized tech stacks without bleed-over.
- **Interactive Skills Badges:** Hoverable tech stack badges displaying dynamic project count tooltips.
- **Modal Contact Form:** Sleek, non-intrusive Call-To-Action banner that opens an animated contact modal with backdrop blur for direct message submission.
- **Smooth Hash Navigation & Back-to-Top:** Seamless scrolling across sections with an integrated back-to-top button in the footer.
- **Modern UI & Responsive Design:** Built using React 18, Framer Motion, Tailwind CSS v4, and Lucide React icons.

### Admin Portal & Security
- **Cyber Vault Login Gate:** Interactive security shutter mechanism with passcode visibility toggle and custom authentication animations.
- **JWT Authentication:** Stateful user authentication backed by secure HTTP-Only Cookies.
- **Protected Routes Guard:** Restricts `/admin` access strictly to authorized administrators.
- **Advanced Dashboard Engine:** 
  * Features real-time search filtering, lightweight text-only rendering, and a smart pagination system for handling large project datasets seamlessly.
- **Full Dynamic Content Management (CRUD):**
  * **Create:** Add new projects with custom tech stacks, advanced URL routing (Live Demo, GIF Media, Specific Source Folder, and Main Repo Root).
  * **Read:** Fetch live projects dynamically from MongoDB.
  * **Update:** Edit existing project details instantly via a pre-filled admin modal.
  * **Delete:** Remove outdated projects with custom warning confirmation guards.
  * **Inbox Management:** Read, mark as read, reply directly, and manage client contact inquiries.

## Tech Stack & Architecture

- **Frontend:** React 18, Vite, React Router DOM v6, Framer Motion, Axios, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js, Express.js, RESTful API Architecture
- **Database:** MongoDB & Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js, HTTP-Only Cookies
- **Version Control:** Git, GitHub (Feature Branching Workflow), Trello (Agile Kanban)

## Repository Structure

```text
portfolio-hub-mern/
├── backend/                  # Express API Server & Database Logic
│   ├── config/               # Database Connection Configuration
│   ├── controllers/          # Request Handlers & Business Logic
│   ├── middlewares/          # JWT Protect Guard & Error Handling
│   ├── models/               # Mongoose Schemas (User, Project, Message)
│   ├── routes/               # API Route Endpoints
│   ├── seeders/              # Database Seeder Scripts
│   └── server.js             # Application Entry Point
│
├── client/                   # Vite React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI Components (ProjectCard3D, AboutAndSkills, ContactForm, Footer)
│   │   ├── context/          # Auth Context Provider
│   │   ├── pages/            # View Pages (LoginPage, AdminDashboard)
│   │   └── App.jsx           # Main Router Setup
│   └── package.json
│
└── README.md                 # Documentation
```

## Local Development Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone Repository
```bash
git clone https://github.com/rajyabdullah-spec/portfolio-hub-mern.git
cd portfolio-hub-mern
```

### 2. Backend Configuration
Navigate to backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_hub
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

Seed initial Admin user and default projects (Optional):
```bash
node seeder.js
```

Run Express Backend Server:
```bash
npm run dev
```

### 3. Frontend Configuration
Open a new terminal, navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Run Vite React Frontend:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

## API Route Specifications

- `POST /api/auth/login` — Public — Authenticates admin & sets HTTP-Only Cookie
- `GET /api/auth/me` — Private — Verifies current active user session
- `POST /api/auth/logout` — Private — Clears authentication cookie
- `GET /api/projects` — Public — Fetches all portfolio projects chronologically
- `POST /api/projects` — Private (Admin) — Creates a new project entry
- `PUT /api/projects/:id` — Private (Admin) — Updates an existing project by ID
- `DELETE /api/projects/:id` — Private (Admin) — Deletes a project by ID
- `POST /api/messages` — Public — Submits contact message to database
- `GET /api/messages` — Private (Admin) — Retrieves all user contact inquiries
- `PUT /api/messages/:id/read` — Private (Admin) — Marks a contact message as read
- `DELETE /api/messages/:id` — Private (Admin) — Deletes a contact message by ID

## Developed By
Raji Al-Abdullah — Full-Stack Software Developer