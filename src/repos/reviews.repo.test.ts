import type { AppPrismaClient } from '../config/db-config.ts';
import { ReviewsRepo } from './reviews.repo.ts';

describe('GIVEN an instance of <ReviewsRepo> class', () => {
    let prismaMock: AppPrismaClient;
    let repo: ReviewsRepo;

    beforeEach(() => {
        prismaMock = {
            genre: {
                findMany: vitest.fn().mockResolvedValue([]),
                findUniqueOrThrow: vitest.fn().mockResolvedValue({}),
                create: vitest.fn().mockResolvedValue({}),
                update: vitest.fn().mockResolvedValue({}),
                delete: vitest.fn().mockResolvedValue({}),
            },
        } as unknown as AppPrismaClient;
        repo = new ReviewsRepo(prismaMock);
    });

    afterEach(() => {
        vitest.clearAllMocks();
    });

    describe('WHEN method <getAllFilmsReviews> is called', () => {
        test('THEN it will return the array of reviews', () => {
            //
        });
    });
});
