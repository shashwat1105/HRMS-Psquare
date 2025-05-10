import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/getAll', getAllEmployees);
router.post('/add', upload.fields([{ name: 'photo', maxCount: 1 }]), createEmployee);
router.patch('/update/:id', upload.fields([{ name: 'photo', maxCount: 1 }]), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;