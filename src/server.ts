import http, { Server } from 'http';
import app from './app';
import { setupShutdown, setupTimeout } from './utils/serverUtils';

const PORT = process.env.PORT || 6969;

const server: Server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setupTimeout(server, 15000);
setupShutdown(server);
