import { env } from '../config/env.ts';
import debug from 'debug';
import type { ReviewsRepo } from '../repos/reviews.repo.ts';
import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { HttpError } from '../errors/http-error.ts';
import type {
    ReviewCreateBodyDTO,
    ReviewUpdateDTO,
} from '../schemas/reviews/review.dto.ts';

const log = debug(`${env.PROJECT_NAME}:controller:reviews`);
log('Loading reviews controller...');

export class ReviewsController {
    #repo: ReviewsRepo;
    constructor(repo: ReviewsRepo) {
        this.#repo = repo;
    }

    async getAllFilmsReviews(req: Request, res: Response, next: NextFunction) {
        log('Getting all reviews for film...');

        try {
            const reviews = await this.#repo.getAllFilmsReviews(
                Number(req.params.filmID),
            );

            return res.json(reviews);
        } catch (error) {
            log('Error getting all film reviews: %O', error);

            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    'Film requested not found',
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to get all film reviews',
                { cause: error },
            );

            return next(finalError);
        }
    }

    async getAllUserReviews(req: Request, res: Response, next: NextFunction) {
        log('Getting all reviews for user...');

        try {
            const reviews = await this.#repo.getAllUserReviews(
                Number(req.params.userID),
            );

            return res.json(reviews);
        } catch (error) {
            log('Error getting all user reviews: %O', error);

            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    'User requested not found',
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to get all user reviews',
                { cause: error },
            );

            return next(finalError);
        }
    }

    // - POST /reviews/:filmId/ [User] -> token :userId

    async createReview(req: Request, res: Response, next: NextFunction) {
        log('Creating review...');

        try {
            const reviewData: ReviewCreateBodyDTO = req.body;
            const review = await this.#repo.createReview({
                ...reviewData,
                filmID: Number(req.params.filmID),
                userID: Number(req.user?.id),
            });

            return res.status(201).json(review);
        } catch (error) {
            log('Error creating review: %O', error);

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to create review',
                { cause: error },
            );

            return next(finalError);
        }
    }

    async updateReview(req: Request, res: Response, next: NextFunction) {
        log('Updating review...');

        try {
            const reviewData: ReviewUpdateDTO = req.body;
            const review = await this.#repo.updateReview(
                Number(req.user?.id),
                Number(req.params.filmID),
                reviewData,
            );

            return res.json(review);
        } catch (error) {
            log('Error updating review: %O', error);

            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    'Review requested not found',
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to update review',
                { cause: error },
            );

            return next(finalError);
        }
    }

    async deleteReview(req: Request, res: Response, next: NextFunction) {
        log('Deleting review...');

        try {
            await this.#repo.deleteReview(
                Number(req.user?.id),
                Number(req.params.filmID),
            );

            return res.status(204).send();
        } catch (error) {
            log('Error deleting review: %O', error);

            if (
                error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025'
            ) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    'Review requested not found',
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to delete review',
                { cause: error },
            );

            return next(finalError);
        }
    }
}
