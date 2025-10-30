const express = require('express');
const DailyTask = require('../models/DailyTask');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get tasks for a date range
router.get('/', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const tasks = await DailyTask.find(query)
      .populate('courseId')
      .sort({ date: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task progress
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await DailyTask.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    ).populate('courseId');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's tasks
router.get('/today', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await DailyTask.find({
      userId: req.userId,
      date: { $gte: today, $lt: tomorrow }
    }).populate('courseId');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get progress statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allTasks = await DailyTask.find({ userId: req.userId });
    const pastTasks = allTasks.filter(task => new Date(task.date) < today);
    
    const completedTasks = pastTasks.filter(task => task.completed).length;
    const totalTasks = pastTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const totalMinutesAllocated = pastTasks.reduce((sum, task) => sum + task.allocatedMinutes, 0);
    const totalMinutesCompleted = pastTasks.reduce((sum, task) => sum + task.completedMinutes, 0);

    res.json({
      completedTasks,
      totalTasks,
      completionRate: Math.round(completionRate),
      totalHoursAllocated: Math.round(totalMinutesAllocated / 60),
      totalHoursCompleted: Math.round(totalMinutesCompleted / 60)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

