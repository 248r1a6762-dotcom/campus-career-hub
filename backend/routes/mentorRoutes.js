import express from 'express';
import { getMentors, matchMentors, scheduleSession, getSessions } from '../controllers/mentorController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', auth, getMentors);
router.post('/match', auth, matchMentors);
router.post('/schedule', auth, scheduleSession);
router.get('/sessions', auth, getSessions);

export default router;
