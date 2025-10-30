const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  allocatedMinutes: {
    type: Number,
    required: true
  },
  completedMinutes: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

dailyTaskSchema.index({ userId: 1, courseId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyTask', dailyTaskSchema);

