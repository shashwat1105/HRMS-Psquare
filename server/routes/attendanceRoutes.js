import express from 'express';
import {
  getAllAttendance,
  updateAttendance,
} from '../controllers/attendanceController.js';

const router = express.Router();

router.get('/getAll',  getAllAttendance);

router.patch('/update/:id', updateAttendance)


export default router;