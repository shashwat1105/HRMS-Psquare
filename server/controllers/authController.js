import User from '../models/User.js';
import { attachCookiesToResponse, verifyJWT } from '../utils/jwt.js';

export const register = async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
  
      const emailAlreadyExists = await User.findOne({ email });
      if (emailAlreadyExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists',
        });
      }
  
      const user = await User.create({ fullName, email, password, role: 'hr' });
  
      const tokenUser  = {
        userId: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
      };
  
      attachCookiesToResponse({ res, user: tokenUser  });
  
      res.status(201).json({
        success: true,
        user: tokenUser ,
      });
    } catch (error) {
      console.error('Error during registration:', error); // Log the error
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  };
  

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
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

    res.status(200).json({
      success: true,
      user: tokenUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ success: true, message: 'User logged out' });
};

// Middleware to protect routes
export const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication invalid',
    });
  }

  try {
    const payload = verifyJWT(token);
    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication invalid',
    });
  }
};