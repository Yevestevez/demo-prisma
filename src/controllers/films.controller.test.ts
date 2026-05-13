import type { Request, Response, NextFunction } from 'express';
import type { FilmsRepo } from '../repos/films.repo.ts';
import { FilmsController } from './films.controller.ts';
import type { InternalServerError } from '../errors/http-error.ts';

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
});
