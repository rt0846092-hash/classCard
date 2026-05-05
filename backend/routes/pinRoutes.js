import express from 'express';
import { 
  pinWord, 
  unpinWord, 
  getPinnedWords 
} from '../controllers/pinController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, pinWord);
router.delete('/:wordId', protect, unpinWord);
router.get('/', protect, getPinnedWords);

export default router;