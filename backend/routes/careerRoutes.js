import express from 'express';
import { getAssessmentQuestions, submitAssessment, getIndustries, getCareerPlan, updateCareerPlan } from '../controllers/careerController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/assessment/questions', getAssessmentQuestions);
router.post('/assessment/submit', auth, submitAssessment);
router.get('/industries', getIndustries);
router.get('/plan', auth, getCareerPlan);
router.put('/plan', auth, updateCareerPlan);

export default router;
