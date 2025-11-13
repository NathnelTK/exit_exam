const DailyTask = require('../models/DailyTask');

const generateDailyPlan = async (userId, studyPlan, courses) => {
  // Clear future tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await DailyTask.deleteMany({ userId, date: { $gte: today } });

  if (courses.length === 0) {
    return;
  }

  // Sort courses by (weight * difficulty) in descending order
  courses.sort((a, b) => (b.weight * b.difficulty) - (a.weight * a.difficulty));

  // Select the top two courses
  const topTwoCourses = courses.slice(0, 2);

  if (topTwoCourses.length === 0) {
    return;
  }

  // Daily available minutes
  const dailyMinutes = studyPlan.dailyStudyHours * 60;

  // Generate tasks for 7 days, alternating between the top two courses
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + day);

    const courseForToday = topTwoCourses[day % topTwoCourses.length];

    if (dailyMinutes > 0) {
      const dailyTasks = [{
        userId,
        courseId: courseForToday._id,
        date: currentDate,
        allocatedMinutes: dailyMinutes,
        completedMinutes: 0,
        completed: false
      }];
      await DailyTask.insertMany(dailyTasks);
    }
  }
};

module.exports = { generateDailyPlan };

