import { RequestHandler } from 'express';
import { fibonacciService, reverseStringService } from '../services/testService';
import { FibonacciParams, ReverseStringBody } from '../types/testTypes';
import { sendSuccessResponse } from '../utils/responseHelper';

export const pingController: RequestHandler = (_req, res) => {
  sendSuccessResponse(res, 'pong', null);
};

// Add caching and library for large numbers
export const fibonacciController: RequestHandler<FibonacciParams> = (req, res) => {
  const { limit } = req.params;
  const resArr: string[] = fibonacciService(Number(limit));
  sendSuccessResponse(res, 'Fibonacci sequence generated', resArr);
};

export const echoRequestController: RequestHandler = (req, res) => {
  sendSuccessResponse(res, 'Request details echoed', { headers: req.headers, params: req.params, query: req.query, body: req.body });
};

export const healthController: RequestHandler = (_req, res) => {
  sendSuccessResponse(res, 'API is healthy', null);
};

export const statusCodeController: RequestHandler = (req, res) => {
  const reqStatus = Number(req.params.code);
  sendSuccessResponse(res, `Status of this response is ${reqStatus}`, null, reqStatus);
};

// Set hard limits on validators for this
// Ensure multiple of these in parallel dont slow down server
export const delayController: RequestHandler = (req, res) => {
  const delay = Number(req.params.ms);
  setTimeout(() => {
    sendSuccessResponse(res, `Delayed response by ${delay}ms`, null);
  }, delay);
};

export const reverseStringController: RequestHandler<unknown, unknown, ReverseStringBody> = async (req, res) => {
  try {
    const { input: inputStr } = req.body;
    const reversedString: string = reverseStringService(inputStr);
    res.json({ reversed: reversedString });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
    throw err;
  }
};
