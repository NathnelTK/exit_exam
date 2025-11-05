const express = require('express');
const StudyPlan = require('../models/StudyPlan');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all study plans for user
router.get('/', authenticate, async (req, res) => {
  try {
    const studyPlans = await StudyPlan.findByUserId(req.userId);
    res.json(studyPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create study plan
router.post('/', authenticate, async (req, res) => {
  try {
    const { courseId, title, scheduledDate } = req.body;
    const studyPlan = await StudyPlan.create(courseId, title, scheduledDate, req.userId);
    res.status(201).json(studyPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;