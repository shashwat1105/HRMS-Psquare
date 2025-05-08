import { StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
  console.error(err.message, err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later',
  };

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    customError.message = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.name === 'JsonWebTokenError') {
    customError.message = 'Invalid token, please login again';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    customError.message = 'Token expired, please login again';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (err.message === 'Invalid file type. Only JPEG, PNG, and PDF are allowed.') {
    customError.message = err.message;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    customError.message = 'File size too large. Maximum size is 5MB';
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
  });
};

export default errorHandler;