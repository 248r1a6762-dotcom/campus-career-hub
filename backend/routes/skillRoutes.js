import express from 'express';
import { getCourses, completeLesson, submitQuiz } from '../controllers/skillController.js';
import { auth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/courses', getCourses);
router.post('/lesson-complete', auth, authorize('student'), completeLesson);
router.post('/quiz-submit', auth, authorize('student'), submitQuiz);

export default router;
