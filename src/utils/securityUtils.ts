import { randomBytes, scrypt as scryptOriginal, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptOriginal);
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}|||${salt}`;
}
export async function comparePassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  const [hashedPassword, salt] = storedPassword.split('|||');
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuf = (await scrypt(suppliedPassword, salt, 64)) as Buffer;
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}

export function expiryToSeconds(expiry: string): number {
  const unit = expiry[expiry.length - 1];
  const value = parseInt(expiry.slice(0, -1), 10);

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error('Invalid expiry format');
  }
};
