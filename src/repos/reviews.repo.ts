import debug from 'debug';

import { env } from '../config/env.ts';
import type { AppPrismaClient } from '../config/db-config.ts';

const log = debug(`${env.PROJECT_NAME}:repo:reviews`);
log('Loading reviews repo...');

export class ReviewsRepo {
    #prisma: AppPrismaClient;

    constructor(prisma: AppPrismaClient) {
        this.#prisma = prisma;
    }

    getAllFilmsReviews = async (filmID: number) => {
        log(`Getting all reviews for film with id ${filmID}...`);

        return await this.#prisma.review.findMany({
            where: {
                filmID,
            },
            omit: {
                filmID: true,
                userID: true,
            },
            include: {
                user: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                surname: true,
                                avatar: true,
                            },
                        },
                    },
                },
                film: {
                    select: {
                        title: true,
                    },
                },
            },
        });
    };
}
