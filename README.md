# Team Task Manager

A full-stack task management app with admin-only projects, team collaboration, and member management.

## Features

### Authentication & User Management

- **Single Admin Policy**: Only one admin account allowed, subsequent signups are members only
- **User Registration**: New members can sign up with role selection (disabled if admin exists)
- **Secure Authentication**: JWT tokens with 1-day expiration + bcrypt password hashing
- **Session Management**: Per-tab sessions using sessionStorage for independent login states
- **User Profiles**: Clickable role badges to view detailed user profiles

### User Profile Management

- **View Profile**: Click role badge to see full user details
- **Profile Information**: Name, email, role, account creation date
- **Password Management**:
  - Eye toggle to show/hide password status
  - Change Password modal with current password verification
  - Secure password hashing with bcrypt

### Admin Features

- **Admin Dashboard**: Create and manage projects
- **Member Management**:
  - View all team members with email and role
  - Delete member accounts
  - Admin accounts cannot be deleted
- **Team Statistics**: View total projects and team member count

### Project Management

- **Admin-only Projects**: Only admins can create top-level projects
- **Project Organization**: Organize tasks by project
- **Project Management**: Admin can delete projects

### Role-Based Access

- **Admin Role**: Full access to create projects, manage members, view statistics
- **Member Role**: Can view and contribute to projects assigned to them
- **Logout Confirmation**: Confirmation modal before logging out

### User Experience

- **Modern Gradient Design**: Beautiful purple gradient theme with animations
- **Responsive Layout**: Mobile-first design, works on all devices
- **Interactive Elements**: Smooth hover effects, fade-in animations
- **Confirmation Modals**: Safe confirmations for destructive actions

## Tech Stack

- **Frontend**: React 19 + Vite 5
- **Backend**: Node.js + Express 5
- **Database**: MongoDB + Mongoose 9
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AltafRaza-AR/Team-Task-Manager.git
   cd Team-Task-Manager
   ```

2. **Backend setup**

   ```bash
   cd backend
   npm install
   cp ../.env.example .env
   # Edit .env and add your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend setup** (in a new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Visit `http://localhost:5173` in your browser

### Environment Variables

Create a `.env` file in the `backend/` folder (see `.env.example` for reference):

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt_tokens
PORT=5000
```

### Backend Deployment (Railway)

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
4. Railway auto-deploys on push to main branch

### Frontend Deployment (Vercel)

1. Import this repository into Vercel
2. Configure build settings:
   - Root Directory: `frontend`
3. Set environment variables in Vercel:
   - `VITE_API_URL=https://your-railway-app-url.up.railway.app`
4. Deploy once from Vercel dashboard
5. Future pushes to `main` auto-deploy via Vercel Git Integration

## Project Structure

```
Team-Task-Manager/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with role (Admin/Member)
│   │   ├── Project.js           # Project schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints (signup, login, change-password, etc.)
│   │   ├── projects.js          # Project endpoints
│   │   └── tasks.js             # Task endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── server.js                # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page with session storage
│   │   │   ├── Signup.jsx       # Signup with admin policy
│   │   │   ├── Dashboard.jsx    # Main dashboard with projects & member management
│   │   │   └── Profile.jsx      # User profile with password management
│   │   ├── components/
│   │   │   └── TaskBoard.jsx    # Task board component
│   │   ├── config/
│   │   │   └── api.js           # API base URL configuration
│   │   ├── utils/
│   │   │   └── auth.js          # JWT token parsing utilities
│   │   ├── App.jsx              # Main router
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── vite.config.js           # Vite configuration
│   ├── vercel.json              # Vercel deployment config with SPA rewrites
│   └── package.json
├── DEPLOY.md                    # Detailed deployment instructions
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

## API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Register new user (forced to Member if admin exists)
- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/user/:id` - Get user profile by ID (authenticated)
- `GET /api/auth/users/count` - Get total user count (admin only)
- `GET /api/auth/users` - Get all users list with roles (admin only)
- `DELETE /api/auth/users/:id` - Delete user account (admin only, cannot delete admins)
- `PUT /api/auth/change-password` - Change user password (authenticated)
- `GET /api/auth/admin-exists` - Check if admin account exists (public)

### Project Routes

- `POST /api/projects` - Create project (admin only)
- `GET /api/projects` - Get all projects with creator info
- `DELETE /api/projects/:id` - Delete project (admin only)

### Task Routes

- `POST /api/tasks/main` - Create main task (admin only)
- `POST /api/tasks/subtask` - Create subtask (authenticated users)
- `GET /api/tasks/project/:projectId` - Get tasks for project
- `PUT /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete task (admin only)

## User Roles & Permissions

### Admin Role

- ✅ Create projects
- ✅ Delete projects
- ✅ Create tasks
- ✅ Delete tasks
- ✅ View all members
- ✅ Delete member accounts (except other admins)
- ✅ Cannot delete their own account
- ✅ Cannot delete other admins

### Member Role

- ✅ View projects
- ✅ Create subtasks
- ✅ Change own password
- ✅ View own profile
- ✅ View team members (list only)
- ❌ Cannot create projects
- ❌ Cannot delete projects
- ❌ Cannot manage members

## Test Accounts

After the first signup, an admin account is created. All subsequent signups will be members:

- **First signup creates Admin** - You become the admin
- **Subsequent signups create Members** - Only members can be created after admin exists


MIT
