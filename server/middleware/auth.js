import jwt from 'jsonwebtoken';
import User from '../models/User.js';

 

export const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const currentUser = await User.findById(decoded.userId); // ✅ Correct key
    
    if (!currentUser) {
      return res.status(401).json({
        message: 'The user belonging to this token no longer exists',
      });
    }

    req.user = currentUser; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Not authorized to access this route',
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};