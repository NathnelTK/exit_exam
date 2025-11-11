const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const db = require('./database.js');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const studyPlanRoutes = require('./routes/studyPlans');
const dailyTaskRoutes = require('./routes/dailyTasks');
const notificationRoutes = require('./routes/notifications');
const materialsRoutes = require('./routes/materials');
const weeklyPlansRoutes = require('./routes/weeklyPlans');
const mockExamRoutes = require('./routes/mockExams');
const { sendDailyNotifications } = require('./utils/notificationScheduler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/daily-tasks', dailyTaskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/weekly-plans', weeklyPlansRoutes);
app.use('/api/mock-exams', mockExamRoutes);

// Schedule daily notifications (runs every day at configured time)
cron.schedule('0 * * * *', async () => {
  await sendDailyNotifications();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

