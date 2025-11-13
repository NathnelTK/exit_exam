const express = require('express');
const Course = require('../models/Course');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all courses for user
router.get('/', authenticate, async (req, res) => {
  try {
    const courses = await Course.findByUserId(req.userId);
    res.json(courses.map(c => ({ _id: c.id, name: c.name, description: c.description, userId: c.userId, weight: c.weight, difficulty: c.difficulty, color: c.color })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, weight, difficulty, color } = req.body;
    const course = await Course.create(name, description, req.userId, weight, difficulty, color);
    res.status(201).json({ _id: course.id, name: course.name, description: course.description, userId: course.userId, weight: course.weight, difficulty: course.difficulty, color: course.color });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update course
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await Course.update(req.params.id, req.userId, req.body);
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.json({ _id: updated.id, name: updated.name, description: updated.description, userId: updated.userId, weight: updated.weight, difficulty: updated.difficulty, color: updated.color });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const ok = await Course.delete(req.params.id, req.userId);
    if (!ok) return res.status(404).json({ message: 'Course not found' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;