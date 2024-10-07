import { createClient } from 'redis';
import { logger } from '../utils/logger';
import { REDIS_HOST, REDIS_PORT } from './envConfig';

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT),
  },
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error: ', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

redisClient.connect();
export default redisClient;
