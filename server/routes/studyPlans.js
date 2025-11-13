const express = require('express');
const StudyPlan = require('../models/StudyPlan');
const UserSettings = require('../models/UserSettings');
const Course = require('../models/Course');
const DailyTask = require('../models/DailyTask');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all study plans for user
router.get('/', authenticate, async (req, res) => {
  try {
    // The frontend expects a user-level study plan/settings object (examDate, dailyStudyHours, etc.).
    const settings = await UserSettings.findByUserId(req.userId);
    if (settings) {
      return res.json(settings);
    }

    // Fallback: return course-level study plans if no settings exist
    const studyPlans = await StudyPlan.findByUserId(req.userId);
    res.json(studyPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create study plan
router.post('/', authenticate, async (req, res) => {
  try {
    const body = req.body;

    // If payload looks like user settings (has examDate or dailyStudyHours), upsert into user_settings
    if (body && (body.examDate || body.dailyStudyHours || body.notificationTime || body.customization)) {
      const saved = await UserSettings.upsert(req.userId, body);
      return res.status(201).json(saved);
    }

    // Otherwise assume it's a course-level study plan
    const { courseId, title, scheduledDate } = body;
    const studyPlan = await StudyPlan.create(courseId, title, scheduledDate, req.userId);
    res.status(201).json(studyPlan);
  } catch (error) {
    console.error('Error in POST /api/study-plans:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// Regenerate today's daily tasks proportional to course weight * difficulty
router.post('/regenerate', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const settings = await UserSettings.findByUserId(userId);
    const courses = await Course.findByUserId(userId);

    if (!courses || courses.length === 0) {
      await DailyTask.deleteForDate(userId, new Date().toISOString().slice(0,10));
      return res.json({ tasks: [] });
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    await DailyTask.deleteForDate(userId, todayStr);

    const dailyMinutes = Math.max(30, Math.round(((settings && settings.dailyStudyHours) ? settings.dailyStudyHours : 2) * 60));
    const weights = courses.map(c => ({ c, w: Math.max(1, (c.weight || 10) * (c.difficulty || 3)) }));
    const totalW = weights.reduce((s, x) => s + x.w, 0);

    let remaining = dailyMinutes;
    const allocations = weights.map((x, idx) => {
      const share = idx === weights.length - 1 ? remaining : Math.round(dailyMinutes * x.w / totalW);
      remaining -= share;
      return { course: x.c, minutes: Math.max(0, share) };
    });

    const created = [];
    for (const a of allocations) {
      if (a.minutes <= 0) continue;
      const task = await DailyTask.create(null, `Study ${a.course.name}`, userId, a.minutes, todayStr, a.course.id);
      created.push({ _id: task.id, allocatedMinutes: a.minutes, completedMinutes: 0, completed: false, date: todayStr, courseId: { _id: a.course.id, name: a.course.name, color: a.course.color } });
    }

    res.json({ tasks: created });
  } catch (error) {
    console.error('Error in POST /api/study-plans/regenerate:', error);
    res.status(500).json({ message: error.message });
  }
});