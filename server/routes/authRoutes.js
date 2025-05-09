import express from 'express';
import { check } from 'express-validator';
import { register, login, logout } from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
const router = express.Router();

router.post( '/register', register);
router.post( '/login', login);
router.get('/logout', logout);

export default router;