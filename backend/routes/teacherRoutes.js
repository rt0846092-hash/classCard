import express from 'express';
import { getStudents, getStudentDetails } from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require teacher role
router.use(protect, authorize('teacher'));

router.get('/students', getStudents);
router.get('/students/:studentId', getStudentDetails);

export default router;