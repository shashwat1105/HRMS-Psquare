import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse } from '../utils/jwt.js';

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Email already exists',
    });
  }

  const user = await User.create({ fullName, email, password, role: 'hr' });

  const tokenUser = { 
    userId: user._id, 
    name: user.fullName, 
    email: user.email, 
    role: user.role 
  };
  
  attachCookiesToResponse({ res, user: tokenUser });
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    user: tokenUser,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  const tokenUser = { 
    userId: user._id, 
    name: user.fullName, 
    email: user.email, 
    role: user.role 
  };
  
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({
    success: true,
    user: tokenUser,
  });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ success: true, message: 'User logged out' });
};