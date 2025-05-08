import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

export default validateRequest;