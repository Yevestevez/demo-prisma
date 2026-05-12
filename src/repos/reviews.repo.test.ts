import type { Mock } from 'vitest';
import type { AppPrismaClient } from '../config/db-config.ts';
import { ReviewsRepo } from './reviews.repo.ts';
import type {
    ReviewCreateDTO,
    ReviewUpdateDTO,
} from '../schemas/reviews/review.dto.ts';

describe('GIVEN an instance of <ReviewsRepo> class', () => {
    let prismaMock: AppPrismaClient;
    let repo: ReviewsRepo;

    beforeEach(() => {
        prismaMock = {
            review: {
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

    describe('WHEN the instance is created', () => {
        test('THEN it should be an instance of <ReviewsRepo>', () => {
            expect(repo).toBeInstanceOf(ReviewsRepo);
        });
    });

    describe('WHEN method <getAllFilmsReviews> is called', () => {
        describe('And the film with the given id exists', () => {
            test('THEN it will return the array of reviews', async () => {
                const reviews = await repo.getAllFilmsReviews(1);

                expect(prismaMock.review.findMany).toHaveBeenCalled();
                expect(reviews).toEqual([]);
            });
        });

        describe('And the film with the given id does NOT exists', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.review.findMany as Mock).mockRejectedValue(
                    new Error('Film not found'),
                );

                await expect(repo.getAllFilmsReviews(999)).rejects.toThrow(
                    'Film not found',
                );
            });
        });
    });

    describe('WHEN method <getAllUserReviews> is called', () => {
        describe('And the user with the given id exists', () => {
            test('THEN it will return the array of reviews', async () => {
                const reviews = await repo.getAllUserReviews(1);

                expect(prismaMock.review.findMany).toHaveBeenCalled();
                expect(reviews).toEqual([]);
            });
        });

        describe('And the user with the given id does NOT exists', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.review.findMany as Mock).mockRejectedValue(
                    new Error('User not found'),
                );

                await expect(repo.getAllUserReviews(999)).rejects.toThrow(
                    'User not found',
                );
            });
        });
    });

    describe('WHEN method <createReview> is called', () => {
        describe('And the user and film with the given ids exist', () => {
            test('THEN it should return the created reviews', async () => {
                const review = await repo.createReview({} as ReviewCreateDTO);

                expect(prismaMock.review.create).toHaveBeenCalled();
                expect(review).toEqual({});
            });
        });

        describe('And the user and/or film with the given ids NOT exist', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.review.create as Mock).mockRejectedValue(
                    new Error('User and/or Film not found'),
                );

                await expect(
                    repo.createReview({} as ReviewCreateDTO),
                ).rejects.toThrow('User and/or Film not found');
            });
        });
    });

    describe('WHEN method <updateReview> is called', () => {
        describe('AND the film and user with the given ids exist', () => {
            test('THEN it should return the updated review', async () => {
                const review = await repo.updateReview(
                    1,
                    2,
                    {} as ReviewUpdateDTO,
                );

                expect(prismaMock.review.update).toHaveBeenCalled();
                expect(review).toEqual({});
            });
        });
        describe('AND the film with the given id does NOT exist', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.review.update as Mock).mockRejectedValue(
                    new Error('Review not found'),
                );

                await expect(
                    repo.updateReview(999, 999, {} as ReviewUpdateDTO),
                ).rejects.toThrow('Review not found');
            });
        });
    });

    describe('WHEN method <deleteReview> is called', () => {
        describe('AND the film and user with the given ids exist', () => {
            test('THEN it should return the deleted review', async () => {
                const review = await repo.deleteReview(1, 2);

                expect(prismaMock.review.delete).toHaveBeenCalled();
                expect(review).toEqual({});
            });
        });
        describe('AND the film with the given id does NOT exist', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.review.delete as Mock).mockRejectedValue(
                    new Error('Review not found'),
                );

                await expect(repo.deleteReview(999, 999)).rejects.toThrow(
                    'Review not found',
                );
            });
        });
    });
});
