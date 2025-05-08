import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '2h';

export const createJWT = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT(user);
  
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  };

  res.cookie('token', token, cookieOptions);
};