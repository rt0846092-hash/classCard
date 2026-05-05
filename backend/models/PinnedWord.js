import mongoose from 'mongoose';

const pinnedWordSchema = new mongoose.Schema({
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
  pinnedAt: {
    type: Date,
    default: Date.now
  }
});

pinnedWordSchema.index({ userId: 1, wordId: 1 }, { unique: true });

export default mongoose.model('PinnedWord', pinnedWordSchema);
