<<<<<<< HEAD
# exit_exam
exam preparation planner for ethiopia exit exam
=======
# Exit - Exam Preparation Planner & Notifier

A comprehensive exam preparation app that helps you plan, track, and stay on top of your study schedule with intelligent time allocation and daily notifications.

## Features

### Core Features
- **🕒 Countdown Timer**: Big, beautiful countdown timer showing days, hours, minutes, and seconds until your exam
- **📚 Course Management**: Add courses with custom weights (question count) and difficulty ratings (1-5)
- **📅 Smart Study Planning**: Automatically generates daily study plans based on:
  - Time remaining until exam
  - Course weight (number of questions)
  - Course difficulty level
  - Your daily study hours
- **✅ Progress Tracking**: Mark tasks complete and track actual study time vs planned time
- **🔔 Daily Notifications**: Receive browser notifications at your chosen time each day
- **🎨 Notion-like Customization**: 
  - Light/Dark theme
  - Custom primary and background colors
  - Grid or List layout options
  - Per-course color coding

### Additional Features
- User authentication (register/login)
- Responsive design for mobile and desktop
- Real-time countdown updates
- Visual progress bars
- Course difficulty weighting in time allocation
- Editable daily tasks

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- Web Push API for notifications
- Node-cron for scheduled tasks

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- React Icons
- React Colorful for color picking
- CSS with custom properties for theming

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Steps

1. **Clone/Navigate to the project**
   ```bash
   cd C:\Users\Administrator\Desktop\exit
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   # Exit - Exam Preparation Planner & Notifier

   Lightweight exam preparation planner that helps you schedule study time, manage courses, track daily tasks, and receive browser notifications.

   This repository uses SQLite (built-in) for simplicity — no MongoDB required.

   ## What changed
   - Replaced MongoDB with SQLite using the `sqlite3` package. The database file is `server/db.sqlite` (auto-created).
   - Backend uses Express and schedules notifications with `node-cron`.
   - Root npm scripts help install deps and run client + server concurrently.

   ## Run locally (exact steps for Windows PowerShell)

   1) Open PowerShell in the project root (example path shown):
   ```powershell
   cd 'C:\Users\PC\Saved Games\exit_exam'
   ```

   2) Install all dependencies (root installs client and server deps):
   ```powershell
   npm run install-all
   ```

   3) Start the app in development (runs backend and frontend concurrently):
   ```powershell
   npm run dev
   ```

   Alternative: run server and client in separate terminals

   - Server:
   ```powershell
   cd 'C:\Users\PC\Saved Games\exit_exam\server'
   npm run dev
   ```

   - Client:
   ```powershell
   cd 'C:\Users\PC\Saved Games\exit_exam\client'
   npm start
   ```

   4) Open the frontend in your browser:
   http://localhost:3000

   API base URL: http://localhost:5000 (server default port)

   ## Notes on database & env
   - The app uses SQLite. The DB file `db.sqlite` will be created automatically by `server/database.js` in the `server` folder.
   - No MongoDB setup is required.
   - Optional env var: `PORT` (if you want the server to run on a different port). There are currently no required `.env` keys for basic local usage.

   ## Git identity and commit
   - If Git complains about unknown identity (fatal: unable to auto-detect email address), set your local repo identity:
   ```powershell
   git config user.name "NathnelTK"
   git config user.email "you@example.com"
   ```
   - In this session I set a local git name/email to commit README changes (name: `NathnelTK`, email: `NathnelTK@users.noreply.github.com`). You can change that to your preferred email.

   ## Scripts
   - `npm run install-all` — install root, client, and server dependencies
   - `npm run dev` — start server (nodemon) and client (CRA) concurrently
   - `npm run build` — build the React app (client)

   ## Troubleshooting
   - If ports are in use, set `PORT` environment variable before starting the server, e.g. in PowerShell:
   ```powershell
   $env:PORT = 6000; npm run dev
   ```
   - If push fails when I push README changes, ensure your Git credentials (SSH key or credential helper) are set locally.

   ## License
   ISC

   ---
   Updated README: documents SQLite usage and exact local run commands.
