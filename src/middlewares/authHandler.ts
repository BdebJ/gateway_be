import { RequestHandler } from 'express';
import { jwtVerify } from 'jose';
import { ACCESS_TOKEN_SECRET } from '../config/envConfig';

export const authHandler: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing' }); return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ACCESS_TOKEN_SECRET));
    req.user = { username: payload.sub as string };
    next();
  } catch (_err) {
    res.status(401).json({ message: 'Invalid or expired access token' });
  }
};
