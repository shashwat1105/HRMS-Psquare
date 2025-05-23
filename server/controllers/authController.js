import User from '../models/User.js';
import { attachCookiesToResponse, verifyJWT } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
  
      const emailAlreadyExists = await User.findOne({ email });
      if (emailAlreadyExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const user = await User.create({ fullName, email, password, role: 'hr' });
  
      const tokenUser  = {
        userId: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
      };
  
const token = jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });  

res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        });
      res.status(201).json({message: 'User registered successfully',user: tokenUser ,token:token});

    } catch (error) {
      console.error('Error during registration:', error); 
      res.status(500).json({ message: 'Registration failed',error: error});
    }
  };
  

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials'});
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokenUser = {
      userId: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role
    };

const token=jwt.sign(tokenUser,process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRE});

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        secure: process.env.NODE_ENV === 'production',
        signed: true,
      });
    res.status(200).json({message:"User Login Successfully!",user: tokenUser,token:token});

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

 