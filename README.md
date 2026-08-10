# Portfolio Hub — Full-Stack MERN Portfolio Application

Portfolio Hub is a modern, production-ready Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered to showcase software development projects, accept direct client inquiries, and manage dynamic content via a secure, role-based Admin Panel.

## Key Features

### Public Client Features
- Hero Section & Bio: Highlighting professional skills and developer overview.
- Dynamic Projects Showcase: Fetches live projects directly from MongoDB via RESTful API.
- Interactive Contact Form: Sends user inquiries directly to the database with real-time feedback.
- Smooth Hash Navigation: Seamless scrolling across sections with persistent routing fallback.
- Modern UI & Responsive Design: Built using React, Tailwind CSS v4, and Lucide React icons.

### Admin Portal & Security
- JWT Authentication: Stateful user authentication backed by secure HTTP-Only Cookies.
- Protected Routes Guard: Restricts /admin access strictly to authorized administrators.
- Dynamic Content Management (CRUD):
  * Add new projects with custom tech stacks, GitHub repos, and live demos.
  * Delete existing projects.
  * Read and manage client contact messages inbox.
- Session Persistence: Auto-checks session validity across page reloads without re-login prompts.

## Tech Stack & Architecture

- Frontend: React 18, Vite, React Router DOM v6, Axios, Tailwind CSS v4, Lucide Icons
- Backend: Node.js, Express.js, RESTful API Architecture
- Database: MongoDB & Mongoose ORM
- Authentication: JSON Web Tokens (JWT), Bcrypt.js, HTTP-Only Cookies
- Version Control: Git, GitHub (Feature Branching Workflow), Trello (Agile Kanban)

## Repository Structure

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
│   │   ├── components/       # Reusable UI Components
│   │   ├── context/          # Auth Context Provider
│   │   ├── pages/            # View Pages (LoginPage, AdminDashboard)
│   │   └── App.jsx           # Main Router Setup
│   └── package.json
│
└── README.md                 # Documentation

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

Create a .env file inside the backend folder:
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/portfolio_hub
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

Seed initial Admin user (Optional):
node seeders/seeder.js -i

Run Express Backend Server:
npm run dev

### 3. Frontend Configuration
Open a new terminal, navigate to the client directory and install dependencies:
cd client
npm install

Run Vite React Frontend:
npm run dev

The application will be accessible at http://localhost:5173.

## API Route Specifications

- POST /api/auth/login — Public — Authenticates admin & sets HTTP-Only Cookie
- GET /api/auth/me — Private — Verifies current active user session
- POST /api/auth/logout — Private — Clears authentication cookie
- GET /api/projects — Public — Fetches all portfolio projects
- POST /api/projects — Private (Admin) — Creates a new project entry
- DELETE /api/projects/:id — Private (Admin) — Deletes a project by ID
- POST /api/messages — Public — Submits contact message to database
- GET /api/messages — Private (Admin) — Retrieves all user contact inquiries
- DELETE /api/messages/:id — Private (Admin) — Deletes a contact message by ID

## Developed By
Raji Al-Abdullah — Full-Stack Software Developer