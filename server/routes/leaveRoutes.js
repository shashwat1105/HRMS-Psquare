import express from 'express';
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

router.post('/create',upload.fields([{name:'docs',maxCount:1}]),createLeave);
 router.get('/getAll', getAllLeaves);

router.get('/calendar',getCalendarLeaves)

// router
//   .route('/:id/status')
//   .patch(authenticateUser, authorizeRoles('hr'), updateLeaveStatus);

// router
//   .route('/:id/docs/:docId')
//   .get(authenticateUser, authorizeRoles('hr'), downloadLeaveDoc);

// router
//   .route('/:id')
//   .delete(authenticateUser, authorizeRoles('hr'), deleteLeave);

export default router;