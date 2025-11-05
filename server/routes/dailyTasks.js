const express = require('express');
const DailyTask = require('../models/DailyTask');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all daily tasks for user
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await DailyTask.findByUserId(req.userId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create daily task
router.post('/', authenticate, async (req, res) => {
  try {
    const { studyPlanId, task } = req.body;
    const dailyTask = await DailyTask.create(studyPlanId, task, req.userId);
    res.status(201).json(dailyTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;