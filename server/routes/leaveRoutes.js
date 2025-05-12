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

router.patch('/update/:id', updateLeaveStatus);


router.get('/calendar',getCalendarLeaves)


 

export default router;