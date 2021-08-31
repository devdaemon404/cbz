import ErrorResponse from '../utils/errorResponse';
import { logger } from '../utils/logger';
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  //Log to console for dev
  logger.error(err.message);

  if (process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }

  //Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${JSON.stringify(
      err.value
    )}`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(
      (value: any) => value.message
    );
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
