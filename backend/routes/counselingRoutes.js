import express from 'express';
import { getCounselingSessions, bookCounselingSession } from '../controllers/counselingController.js';
import { auth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/sessions', auth, authorize('student'), getCounselingSessions);
router.post('/book', auth, authorize('student'), bookCounselingSession);

export default router;
