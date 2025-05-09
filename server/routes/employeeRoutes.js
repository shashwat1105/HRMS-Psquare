import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import upload from '../config/multer.js';

const router = express.Router();

router.get('/getAll', getAllEmployees);
router.post('/add',upload.fields({name:'photo', maxCount:1}),createEmployee )

router.patch('update/:id',upload.fields('photo'),updateEmployee)
  router.delete('/:id', deleteEmployee);

export default router;