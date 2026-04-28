import debug from 'debug';
import type { Request, Response, NextFunction } from 'express';

import { env } from '../config/env.ts';
import { HttpError } from '../errors/http-error.ts';
import { AuthService } from '../services/auth.ts';

const log = debug(`${env.PROJECT_NAME}:middleware:auth`);
log('Initializing auth interceptor middleware...');

const unauthorizedError = new HttpError(
    401,
    'Unauthorized',
    'Authentication failed. Please provide valid credentials.',
);

export class AuthInterceptor {
    authenticate(req: Request, _res: Response, next: NextFunction) {
        log('Authenticating request...');

        const authHeader = req.header('authorization');

        if (!authHeader) {
            log('No authorization header provided');
            return next(unauthorizedError);
        }

        const [type, token] = authHeader.split(' ');

        if (!token || type !== 'Bearer') {
            log('No token provided in authorization header');
            return next(unauthorizedError);
        }

        try {
            const payload = AuthService.verifyToken(token);
            req.user = payload;

            return next();
        } catch (error) {
            unauthorizedError.cause = error;
            log('Token verification failed:', { error });

            return next(unauthorizedError);
        }
    }
}
