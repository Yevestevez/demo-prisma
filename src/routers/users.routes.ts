import { Router } from 'express';

import { env } from '../config/env.ts';
import debug from 'debug';
import type { UsersController } from '../controllers/users.controller.ts';
import { validateBody, validateId } from '../middleware/validations.ts';
import {
    RegisterUserDTOSchema,
    UpdateUserDTOSchema,
    UserCredentialsDTOSchema,
} from '../zod/user.schemas.ts';
import type { AuthInterceptor } from '../middleware/auth.interceptor.ts';

const log = debug(`${env.PROJECT_NAME}:router:users`);
log('Loading Users router...');

export class UsersRouter {
    #controller: UsersController;
    #authInterceptor: AuthInterceptor;
    #router: Router;

    constructor(controller: UsersController, authInterceptor: AuthInterceptor) {
        log('Starting Users router...');
        this.#controller = controller;
        this.#authInterceptor = authInterceptor;
        this.#router = Router();

        this.router.get(
            '/',
            this.#authInterceptor.authenticate,
            this.#controller.getAllUsers,
        );
        this.#router.get(
            '/:id',
            validateId(),
            this.#authInterceptor.authenticate,
            this.#controller.getUserById,
        );

        this.#router.post(
            '/register',
            validateBody(RegisterUserDTOSchema),
            this.#controller.register,
        );
        this.#router.post(
            '/login',
            validateBody(UserCredentialsDTOSchema),
            this.#controller.login,
        );

        this.#router.patch(
            '/:id',
            validateId(),
            validateBody(UpdateUserDTOSchema),
            this.#authInterceptor.authenticate,
            this.#controller.updateUser,
        );

        this.#router.delete(
            '/:id',
            validateId(),
            this.#authInterceptor.authenticate,
            this.#controller.deleteUser,
        );
    }

    get router() {
        return this.#router;
    }
}
