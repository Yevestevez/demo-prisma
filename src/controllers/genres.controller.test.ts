import type { Request, Response, NextFunction } from 'express';
import type { GenreRepo } from '../repos/genre.repo.ts';
import { GenresController } from './genres.controller.ts';
import type {
    InternalServerError,
    NotFoundError,
} from '../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.ts';

describe('GIVEN <GenresController> class', () => {
    let repo: GenreRepo;
    let controller: GenresController;

    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(async () => {
        repo = {} as GenreRepo;
        controller = new GenresController(repo);

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
        test('THEN it should be an instance of <GenresController>', () => {
            expect(controller).toBeInstanceOf(GenresController);
        });
    });

    describe('WHEN method <getAllGenres> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with a list of genres', async () => {
                repo.getAllGenres = vi.fn().mockResolvedValueOnce([]);

                await controller.getAllGenres(req, res, next);

                expect(repo.getAllGenres).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throws an error', () => {
            test('THEN it should call <next> with an <InternalServerError>', async () => {
                repo.getAllGenres = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getAllGenres(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <getGenreById> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN ir should call json with a genre', async () => {
                const mockGenre = { id: 1 };
                req.params = { id: '1' };
                repo.getGenreById = vi.fn().mockResolvedValueOnce(mockGenre);

                await controller.getGenreById(req, res, next);

                expect(repo.getGenreById).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith(mockGenre);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN ir should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                repo.getGenreById = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.getGenreById(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN ir should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                repo.getGenreById = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getGenreById(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <createGenre> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <status> with 201 and <json> with the new genre', async () => {
                const mockGenre = { id: 1 };
                req.body = { name: 'Any title' };
                repo.createGenre = vi.fn().mockResolvedValueOnce(mockGenre);

                await controller.createGenre(req, res, next);

                expect(repo.createGenre).toHaveBeenCalledWith(req.body.name);
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.status(201).json).toHaveBeenCalledWith(mockGenre);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throws an error', () => {
            test('THEN it should call <next> with an <InternalServerError>', async () => {
                req.body = { name: 'Any title' };
                repo.createGenre = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.createGenre(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <updateGenre> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with the updated genre', async () => {
                const mockGenre = { id: 1 };
                req.params = { id: '1' };
                req.body = { name: 'Any title' };
                repo.updateGenre = vi.fn().mockResolvedValueOnce(mockGenre);

                await controller.updateGenre(req, res, next);

                expect(repo.updateGenre).toHaveBeenCalledWith(1, req.body.name);
                expect(res.json).toHaveBeenCalledWith(mockGenre);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN ir should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                req.body = { name: 'Any title' };
                repo.updateGenre = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.updateGenre(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN ir should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                req.body = { name: 'Any title' };
                repo.updateGenre = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.updateGenre(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <deleteGenre> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with the deleted genre', async () => {
                const deletedGenre = { id: 1 };
                req.params = { id: '1' };
                repo.deleteGenre = vi.fn().mockResolvedValueOnce(deletedGenre);

                await controller.deleteGenre(req, res, next);

                expect(repo.deleteGenre).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith(deletedGenre);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN ir should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                repo.deleteGenre = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.deleteGenre(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN ir should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                repo.deleteGenre = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.deleteGenre(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });
});
