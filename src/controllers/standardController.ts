import { RequestHandler } from 'express';
import { delayService, fibonacciService, reverseStringService } from '../services/standardService';
import { SuccessResponse } from '../types/common';
import { BadRequestError } from '../types/errorTypes';
import { DelayParams, FibonacciParams, ReverseStringBody, StatusCodeParams } from '../types/standardTypes';

export const pingController: RequestHandler<unknown, SuccessResponse> = (_req, res) => {
  res.status(200).json({ message: 'pong' });
};

// Add caching and library for large numbers
export const fibonacciController: RequestHandler<FibonacciParams, SuccessResponse<string[]>> = (req, res) => {
  const { limit } = req.params;
  const resArr: string[] = fibonacciService(Number(limit));
  res.status(200).json({ message: 'Fibonacci sequence generated', data: resArr });
};

export const echoRequestController: RequestHandler<unknown, SuccessResponse> = (req, res) => {
  res.status(200).json({
    message: 'Request details echoed',
    data: { headers: req.headers, params: req.params, query: req.query, body: req.body }
  });
};

export const healthController: RequestHandler<unknown, SuccessResponse> = (_req, res) => {
  res.status(200).json({ message: 'API is healthy' });
};

export const statusCodeController: RequestHandler<StatusCodeParams, SuccessResponse> = (req, res) => {
  const reqStatus = Number(req.params.code);
  res.status(reqStatus).json({ message: `Status of this response is ${reqStatus}` });
};

// Set hard limits on validators for this
// Ensure multiple of these in parallel dont slow down server
export const delayController: RequestHandler<DelayParams, SuccessResponse> = async (req, res, next) => {
  try {
    const delay = Number(req.params.ms);
    await delayService(delay);
    res.status(200).json({ message: `Delayed response by ${delay}ms` });
  } catch (err) {
    next(err);
  }
};

export const reverseStringController: RequestHandler<unknown, SuccessResponse<string>, ReverseStringBody> = (req, res) => {
  const { input: inputStr } = req.body;
  const reversedString = reverseStringService(inputStr);
  res.status(200).json({ message: 'String reversed', data: reversedString });
};

export const echoUploadController: RequestHandler<unknown, Buffer> = async (req, res, next) => {
  try {
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk));
      });

      req.on('end', () => {
        resolve();
      });

      req.on('error', (_err) => {
        reject(new BadRequestError('Error receiving data'));
      });
    });
    const data = Buffer.concat(chunks);
    res.attachment().setHeader('Content-Type', req.headers['content-type'] || 'application/octet-stream');
    res.send(data);
  } catch (error) {
    next(error);
  }
};

