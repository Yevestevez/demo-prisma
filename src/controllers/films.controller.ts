import debug from 'debug';
import type { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import { env } from '../config/env.ts';
import { HttpError } from '../errors/http-error.ts';
import type { FilmsRepo } from '../repos/films.repo.ts';
import type {
    Film,
    FilmCreateDTO,
    FilmUpdateDTO,
} from '../zod/film.schemas.ts';

const log = debug(`${env.PROJECT_NAME}:controller:films`);
log('Starting films controller...');

export class FilmsController {
    #repo: FilmsRepo;

    constructor(repo: FilmsRepo) {
        this.#repo = repo;
    }

    getAllFilms = async (req: Request, res: Response, next: NextFunction) => {
        log('Getting all films...');

        try {
            const films: Film[] = await this.#repo.getAllFilms();

            res.json(films);
        } catch (error) {
            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to get films',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    getFilmById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Getting Film with id ${id} from repo...`);

        try {
            const film: Film = await this.#repo.getFilmById(id);

            res.json(film);
        } catch (error) {
            log('Error getting film by id: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    `Film with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to get film',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    createFilm = async (req: Request, res: Response, next: NextFunction) => {
        log('Creating new film...');

        try {
            const filmData: FilmCreateDTO = req.body;
            const newFilm: Film = await this.#repo.createFilm(filmData);

            res.status(201).json(newFilm);
        } catch (error) {
            log('Error registering film: %O', error);

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to register user',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    updateFilm = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Updating Film with id ${id} in repo...`);

        try {
            const filmData: FilmUpdateDTO = req.body;
            const updatedFilm: Film = await this.#repo.updateFilmById(
                id,
                filmData,
            );

            res.json(updatedFilm);
        } catch (error) {
            log('Error updating film by id: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    `Film with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to update film',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    deleteFilm = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Deleting Film with id ${id} from repo...`);

        try {
            await this.#repo.deleteFilmById(id);

            res.status(204).send();
        } catch (error) {
            log('Error deleting film by id: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    `Film with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to delete film',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };
}
