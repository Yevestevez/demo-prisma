import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import type { ReviewsRepo } from '../repos/reviews.repo.ts';
import { ReviewsController } from './reviews.controller.ts';
import type { HttpError } from '../errors/http-error.ts';

describe('GIVEN <ReviewsController> class', () => {
    let repo: ReviewsRepo;
    let controller: ReviewsController;

    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(async () => {
        repo = {} as ReviewsRepo;
        controller = new ReviewsController(repo);

        req = {} as Request;
        res = {
            status: vi.fn().mockImplementation(() => res),
            json: vi.fn(),
            send: vi.fn(),
        } as unknown as Response;
        next = vi.fn() as NextFunction;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('WHEN it is instantiated', () => {
        test('THEN it should be an instance of <ReviewsController>', () => {
            expect(controller).toBeInstanceOf(ReviewsController);
        });
    });

    describe('WHEN method <getAllFilmsReviews> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with a list of reviews', async () => {
                const mockReviews = [{ id: 1 }];
                req.params = { filmID: '1' };
                repo.getAllFilmsReviews = vi
                    .fn()
                    .mockResolvedValueOnce(mockReviews);

                await controller.getAllFilmsReviews(req, res, next);

                expect(repo.getAllFilmsReviews).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith(mockReviews);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN it should <next> with <HttpError> status 404', async () => {
                req.params = { filmID: '1' };
                repo.getAllFilmsReviews = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.getAllFilmsReviews(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 404,
                        statusMessage: 'Not Found',
                    } as HttpError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <HttpError> status 500', async () => {
                req.params = { filmID: '1' };
                repo.getAllFilmsReviews = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getAllFilmsReviews(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 500,
                        statusMessage: 'Internal Server Error',
                    } as HttpError),
                );
            });
        });
    });

    describe('WHEN method <getAllUserReviews> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with a list of reviews', async () => {
                const mockReviews = [{ id: 1 }];
                req.params = { userID: '1' };
                repo.getAllUserReviews = vi
                    .fn()
                    .mockResolvedValueOnce(mockReviews);

                await controller.getAllUserReviews(req, res, next);

                expect(repo.getAllUserReviews).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith(mockReviews);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN it should <next> with <HttpError> status 404', async () => {
                req.params = { userID: '1' };
                repo.getAllUserReviews = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.getAllUserReviews(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 404,
                        statusMessage: 'Not Found',
                    } as HttpError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <HttpError> status 500', async () => {
                req.params = { userID: '1' };
                repo.getAllUserReviews = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getAllUserReviews(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 500,
                        statusMessage: 'Internal Server Error',
                    } as HttpError),
                );
            });
        });
    });

    describe('WHEN method <createReview> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <status> with 201 and <json> with new review', async () => {
                const mockReview = { id: 1 };
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                req.body = { review: 'Any review', rate: 4 };
                repo.createReview = vi.fn().mockResolvedValueOnce(mockReview);

                await controller.createReview(req, res, next);

                expect(repo.createReview).toHaveBeenCalledWith({
                    ...req.body,
                    filmID: 2,
                    userID: 3,
                });
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith(mockReview);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <HttpError> status 500', async () => {
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                req.body = { review: 'Any review', rate: 4 };
                repo.createReview = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.createReview(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 500,
                        statusMessage: 'Internal Server Error',
                    } as HttpError),
                );
            });
        });
    });

    describe('WHEN method <updateReview> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with updated review', async () => {
                const mockReview = { id: 1 };
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                req.body = { review: 'Updated', rate: 5 };
                repo.updateReview = vi.fn().mockResolvedValueOnce(mockReview);

                await controller.updateReview(req, res, next);

                expect(repo.updateReview).toHaveBeenCalledWith(3, 2, req.body);
                expect(res.json).toHaveBeenCalledWith(mockReview);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN it should <next> with <HttpError> status 404', async () => {
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                req.body = { review: 'Updated', rate: 5 };
                repo.updateReview = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.updateReview(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 404,
                        statusMessage: 'Not Found',
                    } as HttpError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <HttpError> status 500', async () => {
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                req.body = { review: 'Updated', rate: 5 };
                repo.updateReview = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.updateReview(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 500,
                        statusMessage: 'Internal Server Error',
                    } as HttpError),
                );
            });
        });
    });

    describe('WHEN method <deleteReview> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <status> with 204 and <send>', async () => {
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                repo.deleteReview = vi.fn().mockResolvedValueOnce({ id: 1 });

                await controller.deleteReview(req, res, next);

                expect(repo.deleteReview).toHaveBeenCalledWith(3, 2);
                expect(res.status).toHaveBeenCalledWith(204);
                expect(res.send).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN it should <next> with <HttpError> status 404', async () => {
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                repo.deleteReview = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.deleteReview(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 404,
                        statusMessage: 'Not Found',
                    } as HttpError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <HttpError> status 500', async () => {
                req.params = { filmID: '2' };
                req.user = { id: 3 };
                repo.deleteReview = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.deleteReview(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({
                        status: 500,
                        statusMessage: 'Internal Server Error',
                    } as HttpError),
                );
            });
        });
    });
});
