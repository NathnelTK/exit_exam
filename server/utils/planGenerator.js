const DailyTask = require('../models/DailyTask');

const generateDailyPlan = async (userId, studyPlan, courses) => {
  // Clear future tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await DailyTask.deleteMany({ userId, date: { $gte: today } });

  if (courses.length === 0) {
    return;
  }

  // Calculate days until exam
  const examDate = new Date(studyPlan.examDate);
  examDate.setHours(0, 0, 0, 0);
  const daysUntilExam = Math.max(1, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));

  // Calculate total weight considering difficulty
  const totalWeight = courses.reduce((sum, course) => {
    return sum + (course.weight * course.difficulty);
  }, 0);

  // Daily available minutes
  const dailyMinutes = studyPlan.dailyStudyHours * 60;

  // Generate tasks for each day
  for (let day = 0; day < daysUntilExam; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + day);

    let remainingMinutes = dailyMinutes;
    const dailyTasks = [];

    // Distribute time across courses based on weight and difficulty
    courses.forEach((course, index) => {
      const courseWeight = course.weight * course.difficulty;
      let allocatedMinutes;

      if (index === courses.length - 1) {
        // Last course gets remaining time
        allocatedMinutes = remainingMinutes;
      } else {
        allocatedMinutes = Math.round((courseWeight / totalWeight) * dailyMinutes);
        remainingMinutes -= allocatedMinutes;
      }

      if (allocatedMinutes > 0) {
        dailyTasks.push({
          userId,
          courseId: course._id,
          date: currentDate,
          allocatedMinutes,
          completedMinutes: 0,
          completed: false
        });
      }
    });

    // Save daily tasks
    await DailyTask.insertMany(dailyTasks);
  }
};

module.exports = { generateDailyPlan };

