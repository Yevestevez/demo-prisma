import type { PrismaClient } from '../../generated/prisma/client.ts';
import type {
    ReviewCreateInput,
    ReviewUpdateInput,
} from '../../generated/prisma/models.ts';

import { env } from '../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:repo:reviews`);
log('Loading reviews repo...');

export class ReviewsRepo {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    }

    getUserReviews = async (userId: number) => {
        const result = await this.#prisma.review.findMany({
            where: {
                userID: userId,
            },
        });

        // TODO -> Que no haya reviews no es un error
        if (result.length === 0) {
            throw new Error('Reviews Not Found');
        }

        return result;
    };

    getFilmReviews = async (filmId: number) => {
        const result = await this.#prisma.review.findMany({
            where: {
                filmID: filmId,
            },
        });

        // TODO -> Que no haya reviews no es un error
        if (result.length === 0) {
            throw new Error('Reviews Not Found');
        }

        return result;
    };

    // TODO -> PERMISOS SOLO PARA USER
    createReview = async (reviewData: ReviewCreateInput) => {
        const result = await this.#prisma.review.create({
            data: reviewData,
        });

        return result;
    };

    // TODO -> PERMISOS SOLO PARA OWNER
    updateReview = async (
        userId: number,
        filmId: number,
        reviewData: ReviewUpdateInput,
    ) => {
        const result = await this.#prisma.review.update({
            where: {
                userID_filmID: {
                    userID: userId,
                    filmID: filmId,
                },
            },
            data: reviewData,
        });

        return result;
    };

    // TODO-> PERMISOS SOLO PARA OWNER Y ADMIN
    deleteReview = async (userId: number, filmId: number) => {
        const result = await this.#prisma.review.delete({
            where: {
                userID_filmID: {
                    userID: userId,
                    filmID: filmId,
                },
            },
        });

        return result;
    };
}
