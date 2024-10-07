import { ErrorRequestHandler } from 'express';
import { BadRequestError, ConflictError, UnauthorizedError } from '../types/errorTypes';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err.message || 'An unexpected error occurred');

  const statusCode = err.statusCode;
  const message = err.message;

  if (err instanceof BadRequestError || err instanceof ConflictError || err instanceof UnauthorizedError) {
    res.status(statusCode).json({ message });
    return;
  }

  res.status(500).json({ message: 'Something went wrong!' });
};
