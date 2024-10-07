import { Server } from 'http';
import { SignalHandler } from '../types/common';
import { logger } from './logger';

export const setupShutdown = (server: Server) => {
  const shutdown: SignalHandler = (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

export const setupTimeout = (server: Server, timeout: number) => {
  server.setTimeout(timeout);
  server.on('timeout', (socket) => {
    logger.warn('Request timed out!');
    socket.write(
      `HTTP/1.1 503 Service Unavailable\r\nContent-Type: application/json\r\nConnection: close\r\n\r\n{"message":"Request timed out!"}`
    );
    socket.end();
  });
};
