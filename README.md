# Exit Planner (React Native Branch)

This branch converts the app to React Native (Expo) for mobile platforms and adds AI-oriented study planning workflows.

## What’s in this branch

- React Native app under `mobile/` (Expo)
- Node/Express backend under `server/`
- New features:
  - Upload PDFs/images/screenshots of past exams: `POST /api/materials`
  - Weekly study plan generation: `POST /api/weekly-plans/generate`
  - Mock exam generation (stub): `POST /api/mock-exams/generate`
  - Existing courses with `weight`, `difficulty`, and `color`
- Removed web `client/` app to focus this branch on mobile

## Mobile app (Expo)

Run on a simulator or device:

```bash
cd mobile
npm install
npm run start
```

Then press `a` for Android emulator, `i` for iOS (macOS), or scan QR with Expo Go.

The app includes screens:
- Dashboard (with hourglass stopwatch UI)
- Settings
- Uploads (PDF/images)
- Weekly Plan (generate)
- Mock Exam (generate)

If testing on a device/emulator, replace `http://localhost:5000` in mobile screens with your machine LAN IP.

## Backend (Express + SQLite)

Run API:

```bash
npm run server
```

Defaults to `http://localhost:5000`.

### Endpoints added in this branch
- `POST /api/materials` multipart/form-data file upload (field: `file`)
- `GET /api/materials` list uploaded items (per user)
- `POST /api/weekly-plans/generate` pick top two courses by `weight × difficulty` and alternate them for 7 days
- `POST /api/mock-exams/generate` return placeholder questions structure ready for AI integration

## Data model

- `courses`: includes `weight`, `difficulty`, `color`
- `daily_tasks`: includes `allocatedMinutes`, `completedMinutes`, `date`, `courseId`

## Notes
- This branch removes the CRA web client. Use the Expo app under `mobile/`.
- For AI features (PDF parsing, focus areas, mock exam generation), integrate OCR/NLP or model APIs in future iterations.
