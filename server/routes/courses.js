const express = require('express');
const Course = require('../models/Course');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all courses for user
router.get('/', authenticate, async (req, res) => {
  try {
    const courses = await Course.findByUserId(req.userId);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create course
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    const course = await Course.create(name, description, req.userId);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;