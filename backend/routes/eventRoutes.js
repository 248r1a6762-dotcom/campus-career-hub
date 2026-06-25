import express from 'express';
import { getEvents, registerForEvent } from '../controllers/eventController.js';
import { auth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.post('/register', auth, authorize('student'), registerForEvent);

export default router;
