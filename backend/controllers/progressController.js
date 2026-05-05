import Progress from '../models/Progress.js';
import Pin from '../models/Pin.js';


// ======================================
// ✅ SAVE PROGRESS
// ======================================
export const saveProgress = async (req, res) => {
  try {
    const { wordId, correct, timeSpent, studyMode } = req.body;
    const userId = req.user._id;

    if (!wordId) {
      return res.status(400).json({ message: 'wordId is required' });
    }

    const progress = await Progress.findOneAndUpdate(
      { userId, wordId },
      {
        $set: {
          studyMode,
          createdAt: new Date(),
          correct
        },
        $inc: {
          timeSpent: timeSpent || 0,
          attempts: 1,
          correctCount: correct ? 1 : 0,
          wrongCount: correct ? 0 : 1
        }
      },
      { upsert: true, new: true }
    );

    // 🔥 REVIEW RULE
    const stillWrong = progress.wrongCount > progress.correctCount;

    // 🔥 PIN AUTO SYNC
    if (stillWrong) {
      await Pin.updateOne(
        { userId, wordId },
        { userId, wordId },
        { upsert: true }
      );
    } else {
      await Pin.deleteOne({ userId, wordId });
    }

    res.json(progress);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================
// ✅ GET ALL PROGRESS (Dashboard)
// ======================================
export const getStudentProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.find({ userId })
      .populate('wordId', 'word meaning level')
      .sort({ createdAt: -1 });

    res.json(progress);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================================
// ✅ REVIEW WORDS (MAIN LOGIC)
// ======================================
export const getReviewWords = async (req, res) => {
  try {
    const userId = req.user._id;

    const words = await Progress.find({
      userId,
      $expr: { $gt: ["$wrongCount", "$correctCount"] }
    }).populate('wordId', 'word meaning example level');

    res.json(words);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};