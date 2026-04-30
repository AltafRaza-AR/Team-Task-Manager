# Team Task Manager

A full-stack task management app with admin-only main tasks and team subtasks.

## Features

- **Admin-only main tasks**: Only admins can create top-level tasks
- **User subtasks**: Any team member can add subtasks to main tasks
- **Task status tracking**: To-Do, In Progress, Done
- **Project management**: Organize tasks by project
- **Role-based access**: Admin and Member roles
- **Responsive design**: Works on mobile and desktop

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: JWT tokens + bcrypt

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Team-Task-Manager.git
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
JWT_SECRET=your_secret_key
PORT=5000
```

### Deployment (Railway)

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Railway auto-deploys on push

## Project Structure

```
Team-Task-Manager/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── Server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   ├── utils/       # Helper functions
│   │   └── index.css    # Global styles
│   └── package.json
├── .gitignore           # Git ignore rules
└── .env.example         # Environment template
```

## API Endpoints

### Auth

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Projects

- `POST /api/projects` - Create project (admin only)
- `GET /api/projects` - Get all projects
- `DELETE /api/projects/:id` - Delete project (admin only)

### Tasks

- `POST /api/tasks/main` - Create main task (admin only)
- `POST /api/tasks/subtask` - Create subtask (any user)
- `GET /api/tasks/project/:projectId` - Get tasks for project
- `PUT /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete task (admin only)

## License

MIT
