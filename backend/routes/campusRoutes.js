import express from 'express';
import {
  getBooks, postBook, markBookUnavailable,
  getStudyGroups, createStudyGroup, joinStudyGroup,
  getLibraryBooks, reserveLibraryBook,
  getHostelRooms, applyForHostel,
  getPayments, processPayment
} from '../controllers/campusController.js';
import { auth, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Books Exchange
router.get('/books', getBooks);
router.post('/books/post', auth, postBook);
router.put('/books/mark-unavailable', auth, markBookUnavailable);

// Study Groups
router.get('/study-groups', auth, getStudyGroups);
router.post('/study-groups/create', auth, createStudyGroup);
router.post('/study-groups/join', auth, joinStudyGroup);

// Library
router.get('/library', getLibraryBooks);
router.post('/library/reserve', auth, reserveLibraryBook);

// Hostel
router.get('/hostel', getHostelRooms);
router.post('/hostel/apply', auth, authorize('student'), applyForHostel);

// Payments
router.get('/payments', auth, authorize('student'), getPayments);
router.post('/payments/pay', auth, authorize('student'), processPayment);

export default router;
