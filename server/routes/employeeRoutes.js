import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth.js';
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import upload from '../utils/multer.js';

const router = express.Router();

router
  .route('/')
  .post(
    authenticateUser,
    authorizeRoles('hr'),
    upload.single('photo'),
    createEmployee
  )
  .get(authenticateUser, authorizeRoles('hr'), getAllEmployees);

router
  .route('/:id')
  .patch(
    authenticateUser,
    authorizeRoles('hr'),
    upload.single('photo'),
    updateEmployee
  )
  .delete(authenticateUser, authorizeRoles('hr'), deleteEmployee);

export default router;