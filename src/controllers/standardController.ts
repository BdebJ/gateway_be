import { RequestHandler } from 'express';
import { delayService, fibonacciService, reverseStringService } from '../services/standardService';
import { DelayParams, FibonacciParams, ReverseStringBody } from '../types/standardTypes';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseHelper';

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
export const delayController: RequestHandler<DelayParams> = async (req, res) => {
  const delay = Number(req.params.ms);
  await delayService(delay);
  sendSuccessResponse(res, `Delayed response by ${delay}ms`, null);
};

export const reverseStringController: RequestHandler<unknown, unknown, ReverseStringBody> = async (req, res) => {
  const { input: inputStr } = req.body;
  const reversedString = reverseStringService(inputStr);
  sendSuccessResponse(res, 'String reversed', reversedString);
};

export const echoUploadController: RequestHandler = (req, res) => {
  const chunks: Buffer[] = [];
  req.on('data', (chunk) => {
    chunks.push(Buffer.from(chunk));
  });
  req.on('end', () => {
    const data = Buffer.concat(chunks);
    res.setHeader('Content-Type', req.headers['content-type'] || 'application/octet-stream');
    res.attachment();
    res.send(data);
  });

  req.on('error', (_err) => {
    sendErrorResponse(res, 'Error recieving data');
  });
};
