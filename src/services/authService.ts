import { jwtVerify, SignJWT } from 'jose';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from '../config/envConfig';
import redisClient from '../config/redisClient';
import { LoginServiceFn, LogoutServiceFn, RefreshTokenServiceFn, RegisterServiceFn, VerifyTokenServiceFn } from '../types/authTypes';
import { ConflictError, UnauthorizedError } from '../types/errorTypes';
import { comparePassword, expiryToSeconds, hashPassword } from '../utils/securityUtils';

export const registerService: RegisterServiceFn = async (username, password) => {
  const hashedPassword = await hashPassword(password);

  const userExists = await redisClient.hexists(username, 'password');
  if (userExists) {
    throw new ConflictError('User already exists');
  }

  await redisClient.hset(username, { password: hashedPassword });
};

export const loginService: LoginServiceFn = async (username, password) => {
  const userDetails = await redisClient.hgetall(username);

  if (!userDetails || !userDetails.password) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(userDetails.password, password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const accessToken = await new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(new TextEncoder().encode(ACCESS_TOKEN_SECRET));

  const refreshToken = await new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(new TextEncoder().encode(REFRESH_TOKEN_SECRET));

  await redisClient.hset(username, 'refreshToken', refreshToken);

  return { accessToken, refreshToken };
};

export const refreshTokenService: RefreshTokenServiceFn = async (refreshToken) => {
  try {
    const { payload } = await jwtVerify(refreshToken, new TextEncoder().encode(REFRESH_TOKEN_SECRET));
    const username = payload.sub;

    const storedToken = await redisClient.hget(username!, 'refreshToken');
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const newAccessToken = await new SignJWT({ sub: username })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(ACCESS_TOKEN_EXPIRY)
      .setIssuedAt()
      .sign(new TextEncoder().encode(ACCESS_TOKEN_SECRET));

    const newRefreshToken = await new SignJWT({ sub: username })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(REFRESH_TOKEN_EXPIRY)
      .setIssuedAt()
      .sign(new TextEncoder().encode(REFRESH_TOKEN_SECRET));

    await redisClient.hset(username!, 'refreshToken', newRefreshToken);
    await redisClient.expire(username!, expiryToSeconds(REFRESH_TOKEN_EXPIRY));

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (_err) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

export const verifyTokenService: VerifyTokenServiceFn = async (token) => {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ACCESS_TOKEN_SECRET));
    return payload.sub;
  } catch (_err) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

export const logoutService: LogoutServiceFn = async (username: string, refreshToken: string) => {
  const storedToken = await redisClient.hget(username, 'refreshToken');

  if (!storedToken || storedToken !== refreshToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  await redisClient.hdel(username, 'refreshToken');
};
