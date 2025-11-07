const express = require('express');
const StudyPlan = require('../models/StudyPlan');
const UserSettings = require('../models/UserSettings');
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