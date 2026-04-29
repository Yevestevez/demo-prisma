import { Router } from 'express';

import { env } from '../config/env.ts';
import debug from 'debug';

import { validateBody, validateId } from '../middleware/validations.ts';

import type { AuthInterceptor } from '../middleware/auth.interceptor.ts';
import type { FilmsController } from '../controllers/films.controller.ts';

const log = debug(`${env.PROJECT_NAME}:router:users`);
log('Loading Users router...');

export class FilmsRouter {
    #controller: FilmsController;
    #authInterceptor: AuthInterceptor;
    #router: Router;

    constructor(controller: FilmsController, authInterceptor: AuthInterceptor) {
        log('Starting Films router...');
        this.#controller = controller;
        this.#authInterceptor = authInterceptor;
        this.#router = Router();

        this.router.get(
            '/',
            this.#authInterceptor.authenticate,
            this.#controller.getAllFilms,
        );
        this.#router.get(
            '/:id',
            validateId(),
            this.#authInterceptor.authenticate,
            this.#controller.getFilmById,
        );

        this.#router.post(
            '/',
            validateBody(RegisterUserDTOSchema),
            this.#controller.,
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
            this.#authInterceptor.isOwnerOrAdmin,
            this.#controller.updateUser,
        );

        this.#router.delete(
            '/:id',
            validateId(),
            this.#authInterceptor.authenticate,
            this.#authInterceptor.isOwnerOrAdmin,
            this.#controller.deleteUser,
        );
    }

    get router() {
        return this.#router;
    }
}
