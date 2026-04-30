import { Router } from 'express';
import debug from 'debug';

import { env } from '../config/env.ts';
import { validateBody, validateId } from '../middleware/validations.ts';
import type { AuthInterceptor } from '../middleware/auth.interceptor.ts';
import type { ReviewsController } from '../controllers/reviews.controller.ts';

const log = debug(`${env.PROJECT_NAME}:router:reviews`);
log('Loading Reviews router...');

export class ReviewsRouter {
    #controller: ReviewsController;
    #authInterceptor: AuthInterceptor;
    #router: Router;

    constructor(
        controller: ReviewsController,
        authInterceptor: AuthInterceptor,
    ) {
        log('Starting Reviews router...');
        this.#controller = controller;
        this.#authInterceptor = authInterceptor;
        this.#router = Router();

        this.#router.get(
            '/films/:filmId',
            validateId(),
            this.#authInterceptor.authenticate,
            this.#authInterceptor.authorize(['USER']),
            this.#controller.getAllFilmsReviews,
        );
    }

    get router() {
        return this.#router;
    }
}
