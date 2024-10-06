import { Redis } from 'ioredis';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

redisClient.on('error', (err) => {
  console.error('Redis connection error', err);
});

redisClient.on('connect', () => {
  console.log('Connected to redis');
});

export default redisClient;
