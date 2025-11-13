# Exit - Exam Preparation Planner & Notifier

A comprehensive exam preparation app that helps you plan, track, and stay on top of your study schedule with intelligent time allocation and daily notifications.

## Features

- **🕒 Countdown Timer**: Live countdown to your exam date
- **📚 Course Management**: Add/edit/delete courses with `weight`, `difficulty (1-5)`, and `color`
- **📅 Smart Study Planning**: Generate daily plan proportional to `weight × difficulty` and your daily hours
- **✅ Progress Tracking**: Mark tasks complete and record actual minutes studied
- **🔔 Daily Notifications**: Web push at your configured time
- **🎨 Customization**: Light/dark, primary/background colors, grid/list layout
- **🔐 Auth**: Register/login (JWT)

## What’s new in this update

- Backend data model extended:
  - `courses`: added `weight INTEGER`, `difficulty INTEGER`, `color TEXT`
  - `daily_tasks`: added `allocatedMinutes`, `completedMinutes`, `date`, `courseId`
- New/updated endpoints:
  - `POST /api/study-plans/regenerate` — regenerate today’s tasks via proportional allocation
  - `GET /api/daily-tasks/today` — today’s tasks joined with course color/name
  - `PUT /api/daily-tasks/:id` — toggle completion and update minutes
  - `PUT /api/courses/:id`, `DELETE /api/courses/:id`
  - Responses normalized to use `_id` for client compatibility
- Notifications:
  - Scheduler rewritten for SQLite models and user settings `notificationTime`
  - Client service worker (`public/sw.js`) and subscription UI in `Settings` (requires VAPID keys)

## Tech Stack

- Backend: Node.js, Express, SQLite (`sqlite3`), JWT, `node-cron`, Web Push API
- Frontend: React 18 (CRA), React Router, Axios, React Icons, React Colorful

## Run locally (Windows PowerShell)

1) Open PowerShell in project root:
```powershell
cd 'C:\Users\PC\Saved Games\exit_exam'
```

2) Install dependencies (root installs client and server):
```powershell
npm run install-all
```

3) Start dev servers (backend + frontend concurrently):
```powershell
npm run dev
```

Frontend: `http://localhost:3000`

API: `http://localhost:5000`

## Environment & Push Notifications

- SQLite DB file: `server/db.sqlite` (auto-created)
- Optional: set `PORT` to change server port
- Web Push (browser):
  - Set `REACT_APP_VAPID_PUBLIC_KEY` in `client` env before `npm start`
  - Set `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` in server env if you enable `webpush.setVapidDetails`
  - In Settings page, click “Enable Push Notifications” to subscribe

## Build frontend

```powershell
npm run build
```

## Building an APK (optional)

This is a web app. To ship an Android APK, wrap the `client/build` with a native container (e.g., Capacitor):

```powershell
cd client
npm install @capacitor/core @capacitor/cli @capacitor/android --save
npx cap init exit-exam-planner com.example.exitexamplanner --web-dir build
npm run build
npx cap add android
npx cap copy
npx cap open android
```

Build APK in Android Studio: Build > Build Bundle(s)/APK(s) > Build APK(s).

Note: Push inside an APK requires native FCM integration (Capacitor Push Notifications) rather than browser web-push.

## Scripts

- `npm run install-all` — install root, client, and server deps
- `npm run dev` — start backend and frontend concurrently
- `npm run build` — build the React app (client)

## License

ISC
