import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((err) => ({
      message: err.msg,
      field: err.param,
    }));
    return res.status(400).json({
      success: false,
      errors: validationErrors,
    });
  }
  next();
};
