import express from 'express';
import { check } from 'express-validator';
import { register, login, logout } from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
const router = express.Router();

router.post(
  '/register',validateRequest, register);

router.post(
  '/login', validateRequest, login);

router.get('/logout', logout);

export default router;