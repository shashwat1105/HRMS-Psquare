import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import {
  createAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController.js';

const router = express.Router();

router
  .route('/')
  .post(authenticateUser, authorizeRoles('hr'), createAttendance)
  .get(authenticateUser, authorizeRoles('hr'), getAllAttendance);

router
  .route('/:id')
  .patch(authenticateUser, authorizeRoles('hr'), updateAttendance)
  .delete(authenticateUser, authorizeRoles('hr'), deleteAttendance);

export default router;