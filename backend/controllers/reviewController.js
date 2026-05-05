import Progress from '../models/Progress.js';

// ✅ GET REVIEW WORDS
export const getReviewWords = async (req, res) => {
  try {
    const userId = req.user._id;

    const reviewWords = await Progress.find({
      userId,
      $expr: { $gt: ["$wrongCount", "$correctCount"] }
    }).populate('wordId');

    res.json(reviewWords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};