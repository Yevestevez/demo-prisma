import { env } from '../config/env.ts';
import debug from 'debug';
import type { Server } from 'node:http';

const log = debug(`${env.PROJECT_NAME}:server:handlers`);
log('Loading server handlers...');

export const listenManager = (server: Server) => {
    const addr = server.address();
    if (addr === null) return;
    let bind;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind =
            addr.address === '::'
                ? `http://localhost:${addr?.port}`
                : `${addr.address}:${addr?.port}`;
    }
    if (env.NODE_ENV !== 'dev') {
        console.log(`Server listening on ${bind}`);
    } else {
        log(`Server listening from ${bind}`);
    }
};
