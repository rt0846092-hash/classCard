import express from 'express';
import {
  saveProgress,
  getStudentProgress,
  getReviewWords
} from '../controllers/progressController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

// save progress
router.post('/', protect, saveProgress);

// dashboard stats
router.get('/my-progress', protect, getStudentProgress);

// review words
router.get('/review', protect, getReviewWords);

export default router;