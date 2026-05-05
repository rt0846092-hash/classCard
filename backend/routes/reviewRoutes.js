import express from 'express';
import { getReviewWords } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getReviewWords);

export default router;