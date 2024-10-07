import http, { Server } from 'http';
import app from './app';
import { logger } from './utils/logger';
import { setupShutdown } from './utils/serverUtils';

const PORT = process.env.PORT || 6969;

const server: Server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// setupTimeout(server, 15000);
setupShutdown(server);
