const express = require('express');
const Course = require('../models/Course');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/generate', authenticate, async (req, res) => {
  try {
    const courses = await Course.findByUserId(req.userId);
    if (!courses || courses.length === 0) return res.json({ days: [] });
    const scored = courses.map(c => ({ c, score: (c.weight || 0) * (c.difficulty || 0) }))
      .sort((a, b) => b.score - a.score);
    const topTwo = scored.slice(0, 2).map(s => s.c);

    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const which = i % 2; // alternate between the two courses
      const course = topTwo[which] || topTwo[0] || courses[0];
      days.push({
        date: d.toISOString().slice(0, 10),
        courseId: course ? course.id : null,
        courseName: course ? course.name : 'TBD',
        minutes: 90
      });
    }
    res.json({ days });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

