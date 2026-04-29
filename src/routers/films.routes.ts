import { Router } from 'express';

import { env } from '../config/env.ts';
import debug from 'debug';

import { validateBody, validateId } from '../middleware/validations.ts';

import type { AuthInterceptor } from '../middleware/auth.interceptor.ts';
import type { FilmsController } from '../controllers/films.controller.ts';
import {
    FilmCreateDTOSchema,
    FilmUpdateDTOSchema,
} from '../zod/film.schemas.ts';

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
            validateBody(FilmCreateDTOSchema),
            this.#authInterceptor.authenticate,
            // Configurar permisos necesarios para crear una película (ej: solo admin)
            this.#controller.createFilm,
        );

        this.#router.patch(
            '/:id',
            validateId(),
            validateBody(FilmUpdateDTOSchema),
            this.#authInterceptor.authenticate,
            // Configurar permisos necesarios para actualizar una película (ej: solo admin)
            this.#controller.updateFilm,
        );

        this.#router.delete(
            '/:id',
            validateId(),
            this.#authInterceptor.authenticate,
            // Configurar permisos necesarios para borrar una película (ej: solo admin)
            this.#controller.deleteFilm,
        );
    }

    get router() {
        return this.#router;
    }
}
