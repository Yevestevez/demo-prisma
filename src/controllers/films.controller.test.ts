import type { Request, Response, NextFunction } from 'express';
import type { FilmsRepo } from '../repos/films.repo.ts';
import { FilmsController } from './films.controller.ts';
import type {
    InternalServerError,
    NotFoundError,
} from '../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.ts';

describe('GIVEN <FilmsController> class', () => {
    let repo: FilmsRepo;
    let controller: FilmsController;

    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(async () => {
        repo = {} as FilmsRepo;
        controller = new FilmsController(repo);

        req = {} as Request;
        res = {
            status: vi.fn().mockReturnValue(res),
            json: vi.fn(),
            send: vi.fn(),
        } as unknown as Response;
        next = vi.fn() as NextFunction;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('WHEN it is instantiated', () => {
        test('THEN it should be an instance of <FilmsRepo>', () => {
            expect(controller).toBeInstanceOf(FilmsController);
        });
    });

    describe('WHEN method <getAllFilms> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with a list of films', async () => {
                repo.getAllFilms = vi.fn().mockResolvedValueOnce([]);

                await controller.getAllFilms(req, res, next);

                expect(repo.getAllFilms).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throws an error', () => {
            test('THEN it should call <next> with an <InternalServerError>', async () => {
                repo.getAllFilms = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getAllFilms(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <getFilmById> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN ir should call json with a film', async () => {
                const mockFilm = { id: 1 };
                req.params = { id: '1' };
                repo.getFilmById = vi.fn().mockResolvedValueOnce(mockFilm);

                await controller.getFilmById(req, res, next);

                expect(repo.getFilmById).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith(mockFilm);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN ir should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                repo.getFilmById = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.getFilmById(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN ir should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                repo.getFilmById = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getFilmById(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <createFilm> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <status> with 201 and <json> with the new film', async () => {
                const mockFilm = { id: 1 };
                req.body = { title: 'Any title' };
                repo.createFilm = vi.fn().mockResolvedValueOnce(mockFilm);

                await controller.createFilm(req, res, next);

                expect(repo.createFilm).toHaveBeenCalledWith(req.body);
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.status(201).json).toHaveBeenCalledWith(mockFilm);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throws an error', () => {
            test('THEN it should call <next> with an <InternalServerError>', async () => {
                req.body = { title: 'Any title' };
                repo.createFilm = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.createFilm(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <updateFilm> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with the updated film', async () => {
                const mockFilm = { id: 1 };
                req.params = { id: '1' };
                req.body = { title: 'Any title' };
                repo.updateFilmById = vi.fn().mockResolvedValueOnce(mockFilm);

                await controller.updateFilm(req, res, next);

                expect(repo.updateFilmById).toHaveBeenCalledWith(1, req.body);
                expect(res.json).toHaveBeenCalledWith(mockFilm);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN ir should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                req.body = { title: 'Any title' };
                repo.updateFilmById = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.updateFilm(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN ir should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                req.body = { title: 'Any title' };
                repo.updateFilmById = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.updateFilm(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <deleteFilm> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <status> with 204 and <send>', async () => {
                req.params = { id: '1' };
                repo.deleteFilmById = vi.fn().mockResolvedValueOnce(undefined);

                await controller.deleteFilm(req, res, next);

                expect(repo.deleteFilmById).toHaveBeenCalledWith(1);
                expect(res.status).toHaveBeenCalledWith(204);
                expect(res.status(204).send).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN ir should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                repo.deleteFilmById = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.deleteFilm(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN ir should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                repo.deleteFilmById = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.deleteFilm(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });
});
