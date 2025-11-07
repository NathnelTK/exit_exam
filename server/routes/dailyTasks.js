const express = require('express');
const DailyTask = require('../models/DailyTask');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all daily tasks for user
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await DailyTask.findByUserId(req.userId);
    res.json(tasks.map(t => ({ _id: t.id, ...t })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create daily task
router.post('/', authenticate, async (req, res) => {
  try {
    const { studyPlanId, task, allocatedMinutes, date, courseId } = req.body;
    const dailyTask = await DailyTask.create(studyPlanId, task, req.userId, allocatedMinutes, date, courseId);
    res.status(201).json({ _id: dailyTask.id, ...dailyTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get today's tasks
router.get('/today', authenticate, async (req, res) => {
  try {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const tasks = await DailyTask.findTodayByUserIdWithCourse(req.userId, dateStr);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await DailyTask.updateById(req.params.id, req.userId, req.body);
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    // shape to client
    const shaped = {
      _id: updated.id,
      studyPlanId: updated.studyPlanId,
      task: updated.task,
      completed: !!updated.completed,
      userId: updated.userId,
      allocatedMinutes: updated.allocatedMinutes || 0,
      completedMinutes: updated.completedMinutes || 0,
      date: updated.date,
      courseId: updated.courseId ? { _id: updated.courseId } : null
    };
    res.json(shaped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;