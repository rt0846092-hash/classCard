import express from 'express';
import Vocabulary from '../models/Vocabulary.js';

const router = express.Router();

/**
 * @route   GET /api/vocabulary
 * @desc    Get all vocabulary
 */
router.get('/', async (req, res) => {
  try {
    const words = await Vocabulary.find();
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/vocabulary/levels
 * @desc    Get all levels
 */
router.get('/levels', async (req, res) => {
  try {
    const levels = await Vocabulary.distinct('level');
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/vocabulary/level/:level
 * @desc    Get vocabulary by level
 */
router.get('/level/:level', async (req, res) => {
  try {
    const words = await Vocabulary.find({ level: req.params.level });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/vocabulary/:id
 * @desc    Get single vocabulary
 */
router.get('/:id', async (req, res) => {
  try {
    const word = await Vocabulary.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(word);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;