const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  examDate: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    default: 'My Exam'
  },
  dailyStudyHours: {
    type: Number,
    default: 4,
    min: 0.5,
    max: 16
  },
  notificationTime: {
    type: String,
    default: '09:00'
  },
  customization: {
    theme: {
      type: String,
      default: 'light'
    },
    primaryColor: {
      type: String,
      default: '#3b82f6'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    layout: {
      type: String,
      default: 'grid'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);

