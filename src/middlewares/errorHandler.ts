import { ErrorRequestHandler } from 'express';
import { BadRequestError, ConflictError, UnauthorizedError } from '../types/errorTypes';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  if (err instanceof BadRequestError || err instanceof ConflictError || err instanceof UnauthorizedError) {
    res.status(statusCode).json({ message }); return;
  }

  res.status(500).json({ message });
};
