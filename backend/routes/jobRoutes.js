import express from 'express';
import { getJobs, postJob, applyForJob, getStudentApplications, getEmployerApplications, updateApplicationStatus } from '../controllers/jobController.js';
import { auth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.post('/post', auth, authorize('employer'), postJob);
router.post('/apply', auth, authorize('student'), applyForJob);
router.get('/student-applications', auth, authorize('student'), getStudentApplications);
router.get('/employer-applications', auth, authorize('employer'), getEmployerApplications);
router.put('/application-status', auth, authorize('employer'), updateApplicationStatus);

export default router;
