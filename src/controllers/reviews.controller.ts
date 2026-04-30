import { env } from '../config/env.ts';
import debug from 'debug';
import type { NextFunction, Request, Response } from 'express';

import { InternalServerError, NotFoundError } from '../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import type { ReviewsRepo } from '../repos/reviews.repo.ts';

const log = debug(`${env.PROJECT_NAME}:controller:reviews`);
log('Loading reviews controller...');

export class ReviewsController {
    #genreRepo: ReviewsRepo;

    constructor(genreRepo: ReviewsRepo) {
        this.#genreRepo = genreRepo;
    }

    getAllFilmsReviews = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const filmId = Number(req.params.id);
        log(`Getting all reviews for film with id ${filmId}...`);

        try {
            const reviews = await this.#genreRepo.getAllFilmsReviews(filmId);
            return res.json(reviews);
        } catch (error) {
            log('Error getting all reviews for film: %O', error);
            const finalError = new InternalServerError(
                `Failed to get reviews for film with id ${filmId}`,
                {
                    cause: error,
                },
            );
            return next(finalError);
        }
    };
}
