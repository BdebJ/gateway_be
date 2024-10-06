import { RequestHandler } from 'express';
import { loginService, logoutService, refreshTokenService, registerService, verifyTokenService } from '../services/authService';
import { AuthBody, AuthTestRes, LogoutBody, RefreshBody, TokenPair } from '../types/authTypes';
import { SuccessResponse } from '../types/common';
import { UnauthorizedError } from '../types/errorTypes';

export const registerController: RequestHandler<unknown, SuccessResponse, AuthBody> = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await registerService(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

export const loginController: RequestHandler<unknown, SuccessResponse<TokenPair>, AuthBody> = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const tokens = await loginService(username, password);
    res.status(200).json({ message: 'Logged in successfully', data: tokens });
  } catch (err) {
    next(err);
  }
};

export const refreshController: RequestHandler<unknown, SuccessResponse<TokenPair>, RefreshBody> = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokenService(refreshToken);
    res.status(200).json({ message: 'Tokens sent successfully', data: tokens });
  } catch (err) {
    next(err);
  }
};

export const authTestController: RequestHandler<unknown, SuccessResponse<AuthTestRes>> = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];
    const username = await verifyTokenService(token);
    res.status(200).json({ message: 'Authentication successful', data: { username } });
  } catch (err) {
    next(err);
  }
};

export const logoutController: RequestHandler<unknown, SuccessResponse, LogoutBody> = async (req, res, next) => {
  try {
    const { username, refreshToken } = req.body;
    await logoutService(username, refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
