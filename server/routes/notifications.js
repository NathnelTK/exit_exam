const express = require('express');
const webpush = require('web-push');
const NotificationSubscription = require('../models/NotificationSubscription');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure web push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@exit.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Get VAPID public key
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || '' });
});

// Subscribe to notifications
router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    
    let subscription = await NotificationSubscription.findOne({ endpoint });
    
    if (subscription) {
      subscription.userId = req.userId;
      subscription.keys = keys;
      await subscription.save();
    } else {
      subscription = new NotificationSubscription({
        userId: req.userId,
        endpoint,
        keys
      });
      await subscription.save();
    }

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unsubscribe
router.delete('/unsubscribe', authenticate, async (req, res) => {
  try {
    const { endpoint } = req.body;
    await NotificationSubscription.deleteOne({ endpoint, userId: req.userId });
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

