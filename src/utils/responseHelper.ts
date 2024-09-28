import { Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../types/common';

export const sendSuccessResponse = <T>(res: Response, message: string, data: T, statusCode: number = 200): void => {
  const response: SuccessResponse<T> = {
    message,
    data
  };
  res.status(statusCode).json(response);
};

export const sendErrorResponse = (res: Response, message: string, statusCode: number = 400): void => {
  const response: ErrorResponse = {
    message
  };
  res.status(statusCode).json(response);
};