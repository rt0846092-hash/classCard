import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vocabulary',
    required: true
  },

  // 🔥 tracking
  correct: {
    type: Boolean,
    default: false
  },

  correctCount: {
    type: Number,
    default: 0
  },

  wrongCount: {
    type: Number,
    default: 0
  },

  attempts: {
    type: Number,
    default: 0
  },

  timeSpent: {
    type: Number,
    default: 0
  },

  studyMode: {
    type: String,
    enum: ['study', 'quiz', 'review'],
    default: 'study'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Progress', progressSchema);