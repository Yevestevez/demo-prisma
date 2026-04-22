import debug from 'debug';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { env } from './config/env.ts';
import { HttpError } from './errors/http-error.ts';
import { errorHandler } from './middleware/error-handler.ts';

import { HomeView } from './views/home.ts';
import { customHeaders } from './middleware/customs.ts';
import type { PrismaClient } from '../generated/prisma/client.ts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createApp = (prisma: PrismaClient) => {
    const log = debug(`${env.PROJECT_NAME}:app`);
    log('Starting Express app...');
    const app = express();

    app.disable('x-powered-by');
    app.use(morgan('dev'));
    app.use(
        cors({
            origin: '*',
        }),
    );
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(customHeaders(env.PROJECT_NAME));
    app.use(express.static('public'));

    app.use('/health', (_req, res) => {
        return res.json({
            status: 'ok',
            timeStamp: new Date().toISOString(),
        });
    });

    app.get('/', async (_req, res) => {
        log('Received request to root endpoint');
        return res.send(await HomeView.render());
    });

    app.get('/api', async (_req, res) => {
        log('Received request to root endpoint');
        return res.send(await HomeView.render());
    });

    app.use((_req, _res, next) => {
        log('Calling errorHandler for 404 error');
        const error = new HttpError(404, 'Not Found', 'Resource not found');
        next(error);
    });

    app.use(errorHandler);

    return app;
};
