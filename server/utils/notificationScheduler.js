const webpush = require('web-push');
const StudyPlan = require('../models/StudyPlan');
const DailyTask = require('../models/DailyTask');
const NotificationSubscription = require('../models/NotificationSubscription');

const sendDailyNotifications = async () => {
  try {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    // Find study plans that have notifications scheduled for this time
    const studyPlans = await StudyPlan.find({ notificationTime: currentTime });

    for (const plan of studyPlans) {
      // Get today's tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasks = await DailyTask.find({
        userId: plan.userId,
        date: { $gte: today, $lt: tomorrow }
      }).populate('courseId');

      if (tasks.length === 0) continue;

      // Calculate days until exam
      const examDate = new Date(plan.examDate);
      const daysUntil = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

      // Get user subscriptions
      const subscriptions = await NotificationSubscription.find({ userId: plan.userId });

      const notificationPayload = JSON.stringify({
        title: `${plan.title} - ${daysUntil} days remaining!`,
        body: `You have ${tasks.length} course(s) to study today. Total time: ${Math.round(tasks.reduce((sum, t) => sum + t.allocatedMinutes, 0) / 60)}h`,
        icon: '/icon.png',
        badge: '/badge.png',
        data: {
          url: '/'
        }
      });

      // Send notifications to all subscriptions
      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys
            },
            notificationPayload
          );
        } catch (error) {
          console.error('Error sending notification:', error);
          // Remove invalid subscriptions
          if (error.statusCode === 410) {
            await NotificationSubscription.deleteOne({ _id: sub._id });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in notification scheduler:', error);
  }
};

module.exports = { sendDailyNotifications };

