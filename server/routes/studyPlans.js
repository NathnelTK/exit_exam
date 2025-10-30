const express = require('express');
const StudyPlan = require('../models/StudyPlan');
const Course = require('../models/Course');
const DailyTask = require('../models/DailyTask');
const { authenticate } = require('../middleware/auth');
const { generateDailyPlan } = require('../utils/planGenerator');

const router = express.Router();

// Get study plan
router.get('/', authenticate, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({ userId: req.userId });
    res.json(studyPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update study plan
router.post('/', authenticate, async (req, res) => {
  try {
    let studyPlan = await StudyPlan.findOne({ userId: req.userId });
    
    if (studyPlan) {
      Object.assign(studyPlan, req.body);
      await studyPlan.save();
    } else {
      studyPlan = new StudyPlan({
        ...req.body,
        userId: req.userId
      });
      await studyPlan.save();
    }

    // Regenerate daily plan
    const courses = await Course.find({ userId: req.userId, completed: false });
    await generateDailyPlan(req.userId, studyPlan, courses);

    res.json(studyPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Regenerate plan
router.post('/regenerate', authenticate, async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOne({ userId: req.userId });
    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    const courses = await Course.find({ userId: req.userId, completed: false });
    await generateDailyPlan(req.userId, studyPlan, courses);

    res.json({ message: 'Plan regenerated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

