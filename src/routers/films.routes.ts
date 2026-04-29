import { Router } from 'express';
import debug from 'debug';

import { env } from '../config/env.ts';
import { validateBody, validateId } from '../middleware/validations.ts';
import type { AuthInterceptor } from '../middleware/auth.interceptor.ts';
import type { FilmsController } from '../controllers/films.controller.ts';
import {
    FilmCreateDTOSchema,
    FilmUpdateDTOSchema,
} from '../zod/film.schemas.ts';

const log = debug(`${env.PROJECT_NAME}:router:users`);
log('Loading Films router...');

export class FilmsRouter {
    #controller: FilmsController;
    #authInterceptor: AuthInterceptor;
    #router: Router;

    constructor(controller: FilmsController, authInterceptor: AuthInterceptor) {
        log('Starting Films router...');
        this.#controller = controller;
        this.#authInterceptor = authInterceptor;
        this.#router = Router();

        this.router.get('/', this.#controller.getAllFilms);
        this.#router.get('/:id', validateId(), this.#controller.getFilmById);

        this.#router.post(
            '/',
            validateBody(FilmCreateDTOSchema),
            this.#authInterceptor.authenticate,
            this.#authInterceptor.authorize(['EDITOR']),
            this.#controller.createFilm,
        );

        this.#router.patch(
            '/:id',
            validateId(),
            validateBody(FilmUpdateDTOSchema),
            this.#authInterceptor.authenticate,
            this.#authInterceptor.authorize(['EDITOR']),
            this.#controller.updateFilm,
        );

        this.#router.delete(
            '/:id',
            validateId(),
            this.#authInterceptor.authenticate,
            this.#authInterceptor.authorize(['EDITOR']),
            this.#controller.deleteFilm,
        );
    }

    get router() {
        return this.#router;
    }
}
