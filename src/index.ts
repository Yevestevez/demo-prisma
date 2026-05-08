import { env } from './config/env.ts';
import debug from 'debug';
import { createServer } from 'node:http';

import { connectDB } from './config/db-config.ts';
import { createApp } from './app.ts';
import { listenManager } from './server/handlers.ts';

const log = debug(`${env.PROJECT_NAME}:index`);

const startServer = async () => {
    log('Starting API server...');
    const prisma = await connectDB();
    const app = createApp(prisma);
    const port = env.PORT || 3000;
    const server = createServer(app);
    log('Server created');
    server.listen(port);
    server.on('listening', () => listenManager(server));
};

await startServer().catch((error) => {
    log('Error starting server:', error);
    process.exit(1);
});
