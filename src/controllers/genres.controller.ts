import { env } from '../config/env.ts';
import debug from 'debug';
import type { NextFunction, Request, Response } from 'express';

import type { GenreRepo } from '../repos/genre.repo.ts';
import type { Genre } from '../zod/film.schemas.ts';
import { InternalServerError, NotFoundError } from '../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

const log = debug(`${env.PROJECT_NAME}:controller:genres`);
log('Loading genres controller...');

export class GenreController {
    #genreRepo: GenreRepo;

    constructor(genreRepo: GenreRepo) {
        this.#genreRepo = genreRepo;
    }

    getAllGenres = async (_req: Request, res: Response, next: NextFunction) => {
        log('Getting all genres...');

        try {
            const genres: Genre[] = await this.#genreRepo.getAllGenres();

            return res.json(genres);
        } catch (error) {
            log('Error getting all genres:', error);
            const finalError = new InternalServerError('Failed to get genres', {
                cause: error,
            });

            return next(finalError);
        }
    };

    getGenreById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Getting genre with id ${id}...`);

        try {
            const genre: Genre = await this.#genreRepo.getGenreById(id);

            return res.json(genre);
        } catch (error) {
            log('Error getting genre by id: %O', error);

            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new NotFoundError(
                    `Genre with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            log('Error getting genre by id: %O', error);
            const finalError = new InternalServerError(
                `Failed to get genre with id ${id}`,
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    createGenre = async (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;
        log(`Creating genre with name ${name}...`);

        try {
            const genre: Genre = await this.#genreRepo.createGenre(name);

            return res.status(201).json(genre);
        } catch (error) {
            log('Error creating genre: %O', error);

            const finalError = new InternalServerError(
                'Failed to create genre',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    updateGenre = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        const { name } = req.body;
        log(`Updating genre with id ${id}...`);

        try {
            const updatedGenre: Genre = await this.#genreRepo.updateGenre(
                id,
                name,
            );

            return res.json(updatedGenre);
        } catch (error) {
            log('Error updating genre by id: %O', error);

            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new NotFoundError(
                    `Genre with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new InternalServerError(
                `Failed to update genre with id ${id}`,
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    deleteGenre = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Deleting genre with id ${id}...`);

        try {
            const deletedGenre: Genre = await this.#genreRepo.deleteGenre(id);

            return res.json(deletedGenre);
        } catch (error) {
            log('Error deleting genre by id: %O', error);

            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new NotFoundError(
                    `Genre with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }

            const finalError = new InternalServerError(
                `Failed to delete genre with id ${id}`,
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };
}
