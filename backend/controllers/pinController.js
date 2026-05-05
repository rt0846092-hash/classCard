import PinnedWord from '../models/PinnedWord.js';

// PIN WORD
export const pinWord = async (req, res) => {
  try {
    const { wordId } = req.body;
    const userId = req.user._id;

    if (!wordId) {
      return res.status(400).json({ message: "wordId is required" });
    }

    // check duplicate manually (better control than relying only on index)
    const exists = await PinnedWord.findOne({ userId, wordId });

    if (exists) {
      return res.status(400).json({ message: "Word already pinned" });
    }

    const pinned = await PinnedWord.create({
      userId,
      wordId
    });

    const result = await pinned.populate('wordId', 'word meaning example level');

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UNPIN WORD
export const unpinWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    const userId = req.user._id;

    const deleted = await PinnedWord.findOneAndDelete({ userId, wordId });

    if (!deleted) {
      return res.status(404).json({ message: "Pinned word not found" });
    }

    res.json({ message: "Word unpinned successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PINNED WORDS
export const getPinnedWords = async (req, res) => {
  try {
    const userId = req.user._id;

    const pinnedWords = await PinnedWord.find({ userId })
      .populate('wordId', 'word meaning example level')
      .sort({ pinnedAt: -1 });

    res.json(pinnedWords);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};