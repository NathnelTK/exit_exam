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
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

5. **Configure Environment Variables**
   
   Create `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/exit-planner
   JWT_SECRET=your_random_secret_key_here
   VAPID_PUBLIC_KEY=your_vapid_public_key
   VAPID_PRIVATE_KEY=your_vapid_private_key
   VAPID_EMAIL=mailto:your-email@example.com
   ```

   To generate VAPID keys for notifications, run:
   ```bash
   cd server
   npx web-push generate-vapid-keys
   ```

6. **Start MongoDB**
   
   Make sure MongoDB is running on your system or use MongoDB Atlas cloud database.

7. **Run the Application**

   From the root directory:
   ```bash
   npm run dev
   ```

   This starts both the backend server (port 5000) and React frontend (port 3000).

   Alternatively, run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

8. **Open the App**
   
   Navigate to `http://localhost:3000` in your browser.

## Usage Guide

### 1. Register/Login
- Create an account or login with existing credentials

### 2. Set Up Your Exam
- Go to Settings (gear icon)
- Fill in:
  - Exam title
  - Exam date
  - Daily study hours (how many hours you can study per day)
  - Notification time (when you want daily reminders)

### 3. Add Courses
- Add each course/subject you need to study
- Set the weight (number of questions in exam)
- Set difficulty (1-5 scale)
- Choose a color for visual identification

### 4. Study According to Plan
- View your countdown timer on the home page
- Check "Today's Plan" to see allocated study time per course
- Mark tasks as complete
- Track actual time spent vs planned time

### 5. Customize Your Experience
- In Settings, customize:
  - Theme (Light/Dark)
  - Primary color
  - Background color
  - Layout (Grid/List)

### 6. Enable Notifications
- Allow browser notifications when prompted
- Receive daily reminders at your chosen time

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Study Plans
- `GET /api/study-plans` - Get user's study plan
- `POST /api/study-plans` - Create/update study plan
- `POST /api/study-plans/regenerate` - Regenerate daily tasks

### Daily Tasks
- `GET /api/daily-tasks` - Get tasks (with date filters)
- `GET /api/daily-tasks/today` - Get today's tasks
- `GET /api/daily-tasks/stats` - Get progress statistics
- `PUT /api/daily-tasks/:id` - Update task progress

### Notifications
- `GET /api/notifications/vapid-public-key` - Get VAPID public key
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `DELETE /api/notifications/unsubscribe` - Unsubscribe

## How the Planning Algorithm Works

The app intelligently distributes study time across courses based on:

1. **Weight**: Number of questions per course
2. **Difficulty**: 1-5 rating affecting time allocation
3. **Total Time**: Days until exam × Daily study hours

Formula: Each course gets time proportional to `weight × difficulty`

Example:
- Course A: 50 questions, difficulty 3 → factor: 150
- Course B: 30 questions, difficulty 5 → factor: 150  
- Both get equal time despite different question counts

## Future Enhancements

- Pomodoro timer integration
- Study session history and analytics
- Progress charts (recharts integration ready)
- Export/import study plans
- Mobile app (React Native)
- Spaced repetition algorithm
- Study goals and milestones
- Collaborative study groups

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Try using MongoDB Atlas for cloud database

### Notifications Not Working
- Check browser notification permissions
- Ensure VAPID keys are correctly set in .env
- Try in a different browser (Chrome/Edge recommended)

### Port Already in Use
- Change PORT in server/.env
- Update proxy in client/package.json

## License

ISC

## Author

Created for exam preparation needs. Feel free to customize and extend!

>>>>>>> c1cbaa7 (chore: add .env.example and local .env; configure env defaults)
