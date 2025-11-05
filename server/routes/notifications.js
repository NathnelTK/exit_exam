const express = require('express');
const NotificationSubscription = require('../models/NotificationSubscription');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Subscribe to notifications
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const subscription = req.body;
    await NotificationSubscription.create(req.userId, subscription);
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;