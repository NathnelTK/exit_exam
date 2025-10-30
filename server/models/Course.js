const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: Number,
    default: 3,
    min: 1,
    max: 5
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);

