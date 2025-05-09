import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import {
  createLeave,
  getAllLeaves,
  getCalendarLeaves,
  updateLeaveStatus,
  downloadLeaveDoc,
  deleteLeave,
} from '../controllers/leaveController.js';
import upload from '../config/multer.js';

const router = express.Router();

router
  .route('/')
  .post(authenticateUser,authorizeRoles('hr'),upload.array('docs', 5),createLeave)
  .get(authenticateUser, authorizeRoles('hr'), getAllLeaves);

router
  .route('/calendar')
  .get(authenticateUser, authorizeRoles('hr'), getCalendarLeaves);

router
  .route('/:id/status')
  .patch(authenticateUser, authorizeRoles('hr'), updateLeaveStatus);

router
  .route('/:id/docs/:docId')
  .get(authenticateUser, authorizeRoles('hr'), downloadLeaveDoc);

router
  .route('/:id')
  .delete(authenticateUser, authorizeRoles('hr'), deleteLeave);

export default router;