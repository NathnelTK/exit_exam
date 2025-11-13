const webpush = require('web-push');
const DailyTask = require('../models/DailyTask');
const NotificationSubscription = require('../models/NotificationSubscription');
const UserSettings = require('../models/UserSettings');

// NOTE: Configure VAPID keys in environment before enabling push in production
// webpush.setVapidDetails('mailto:you@example.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

const sendDailyNotifications = async () => {
  try {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;
    const todayStr = now.toISOString().slice(0, 10);

    const allSubs = await NotificationSubscription.findAll();
    const userIds = [...new Set(allSubs.map(s => s.userId))];

    for (const userId of userIds) {
      const settings = await UserSettings.findByUserId(userId);
      if (!settings || !settings.notificationTime) continue;
      if (settings.notificationTime !== currentTime) continue;

      const tasks = await DailyTask.findTodayByUserIdWithCourse(userId, todayStr);
      if (!tasks || tasks.length === 0) continue;

      const examDate = settings.examDate ? new Date(settings.examDate) : null;
      const todayMid = new Date(todayStr);
      const daysUntil = examDate ? Math.ceil((examDate - todayMid) / (1000 * 60 * 60 * 24)) : null;
      const totalMin = tasks.reduce((s, t) => s + (t.allocatedMinutes || 0), 0);

      const subs = allSubs.filter(s => s.userId === userId);
      const payload = JSON.stringify({
        title: settings.title || 'Study Reminder',
        body: `Today's plan: ${tasks.length} task(s), ${totalMin} minutes` + (daysUntil != null ? ` • ${daysUntil} day(s) left` : ''),
        data: { url: '/' }
      });

      for (const s of subs) {
        try {
          await webpush.sendNotification(s.subscription, payload);
        } catch (error) {
          console.error('Error sending notification:', error && error.body || error);
          if (error && error.statusCode === 410) {
            await NotificationSubscription.deleteById(s.id);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in notification scheduler:', error);
  }
};

module.exports = { sendDailyNotifications };

