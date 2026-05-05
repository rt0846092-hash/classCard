import Vocabulary from '../models/Vocabulary.js';

export const getVocabularyByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const vocab = await Vocabulary.find({ level });
    res.json(vocab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLevels = async (req, res) => {
  try {
    const levels = await Vocabulary.distinct('level');
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVocabularyById = async (req, res) => {
  try {
    const vocab = await Vocabulary.findById(req.params.id);
    if (!vocab) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }
    res.json(vocab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};