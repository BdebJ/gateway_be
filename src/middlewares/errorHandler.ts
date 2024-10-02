import { ErrorRequestHandler } from 'express';
import { BadRequestError, ConflictError } from '../types/errorTypes';
import { sendErrorResponse } from '../utils/responseHelper';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err instanceof BadRequestError) {
    return sendErrorResponse(res, err.message, err.statusCode);
  }

  if (err instanceof ConflictError) {
    return sendErrorResponse(res, err.message, err.statusCode);
  }

  // Default error fallback
  return sendErrorResponse(res, 'Something went wrong!');
};
