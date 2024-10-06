import { EnvResolver } from "../types/common";

const env: EnvResolver = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || fallback!;
};

export const ACCESS_TOKEN_SECRET = env('ACCESS_TOKEN_SECRET');
export const ACCESS_TOKEN_EXPIRY = env('ACCESS_TOKEN_EXPIRY');
export const REFRESH_TOKEN_SECRET = env('REFRESH_TOKEN_SECRET');
export const REFRESH_TOKEN_EXPIRY = env('REFRESH_TOKEN_EXPIRY');
