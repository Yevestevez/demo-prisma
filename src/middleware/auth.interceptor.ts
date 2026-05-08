import debug from 'debug';
import type { Request, Response, NextFunction } from 'express';

import { env } from '../config/env.ts';
import { HttpError } from '../errors/http-error.ts';
import { AuthService } from '../services/auth.ts';
import { Role } from '../../generated/prisma/enums.ts';

const log = debug(`${env.PROJECT_NAME}:middleware:auth`);
log('Initializing auth interceptor middleware...');

const unauthorizedError = new HttpError(
    401,
    'Unauthorized',
    'Authentication failed. Please provide valid credentials.',
);

export class AuthInterceptor {
    authenticate = async (req: Request, _res: Response, next: NextFunction) => {
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
            const payload = await AuthService.verifyTokenAsync(token);
            req.user = payload;
            log('Token verified successfully:', { payload });

            return next();
        } catch (error) {
            unauthorizedError.cause = error;
            log('Token verification failed:', { error });

            return next(unauthorizedError);
        }
    };

    authorize = (roles: string[] = []) => {
        return (req: Request, _res: Response, next: NextFunction) => {
            log('Authorizing request for roles:', { roles });

            if (!req.user) {
                log('No user information found in request');

                return next(unauthorizedError);
            }

            if (
                req.user.role !== Role.ADMIN &&
                !roles.includes(req.user.role)
            ) {
                log('User role not authorized:', { userRole: req.user.role });

                return next(
                    new HttpError(
                        403,
                        'Forbidden',
                        'You do not have permission to access this resource.',
                    ),
                );
            }

            log('User authorized successfully');

            return next();
        };
    };

    isOwnerOrAdmin = (req: Request, _res: Response, next: NextFunction) => {
        log('Checking if user is owner or admin...');

        if (!req.user) {
            log('No user information found in request');

            return next(unauthorizedError);
        }

        const isAdmin = req.user.role === Role.ADMIN;
        const isOwner = req.user.id === Number(req.params.id);

        if (!isAdmin && !isOwner) {
            log('User is not owner or admin:', { userId: req.user.id });

            return next(
                new HttpError(
                    403,
                    'Forbidden',
                    'You do not have permission to access this resource.',
                ),
            );
        }

        log('User is owner or admin, access granted');

        return next();
    };
}
