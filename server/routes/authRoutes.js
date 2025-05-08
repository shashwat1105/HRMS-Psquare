import express from 'express';
import { check } from 'express-validator';
import { register, login, logout } from '../controllers/authController.js';
import validateRequest from '../middleware/validateRequest.js';
const router = express.Router();

router.post(
  '/register',
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }),
    check('confirmPassword', 'Passwords do not match').custom(
      (value, { req }) => value === req.body.password
    ),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  validateRequest,
  login
);

router.get('/logout', logout);

export default router;