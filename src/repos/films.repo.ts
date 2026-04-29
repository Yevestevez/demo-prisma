import debug from 'debug';

import { env } from '../config/env.ts';
import {
    type Film,
    type FilmCreateDTO,
    type FilmUpdateDTO,
} from '../zod/film.schemas.ts';
import type { AppPrismaClient } from '../config/db-config.ts';

const log = debug(`${env.PROJECT_NAME}:repo:films`);
log('Loading films repo...');

export class FilmsRepo {
    #prisma: AppPrismaClient;

    constructor(prisma: AppPrismaClient) {
        this.#prisma = prisma;
    }

    getAllFilms = async (): Promise<Film[]> => {
        log('Getting al films...');

        return this.#prisma.film.findMany({
            include: {
                reviews: {
                    omit: {
                        userID: true,
                        filmID: true,
                    },
                },
                genres: {
                    omit: {
                        id: true,
                    },
                },
            },
        });
    };

    getFilmById = async (id: number): Promise<Film> => {
        log(`Getting film with id ${id}...`);

        return this.#prisma.film.findUniqueOrThrow({
            where: {
                id: id,
            },
            include: {
                reviews: {
                    omit: {
                        userID: true,
                        filmID: true,
                    },
                },
                genres: {
                    omit: {
                        id: true,
                    },
                },
            },
        });
    };

    createFilm = async (filmData: FilmCreateDTO): Promise<Film> => {
        log(`Creating new film...`);

        const newFilm = await this.#prisma.film.create({
            data: {
                title: filmData.title,
                year: filmData.year,
                director: filmData.director,
                duration: filmData.duration,
                poster: filmData.poster,
                rate: filmData.rate,
                genres: {
                    connect: filmData.genres.map((genre) => ({ name: genre })),
                },
            },
            include: {
                genres: {
                    omit: {
                        id: true,
                    },
                },
            },
        });

        return newFilm;
    };

    updateFilmById = async (
        id: number,
        filmData: FilmUpdateDTO,
    ): Promise<Film> => {
        log(`Updating film with id ${id}...`);

        filmData.genres = filmData.genres ?? [];

        return this.#prisma.film.update({
            where: {
                id: id,
            },
            data: {
                title: filmData.title,
                year: filmData.year,
                director: filmData.director,
                duration: filmData.duration,
                poster: filmData.poster,
                rate: filmData.rate,
                genres: {
                    set: filmData.genres.map((genre) => ({ name: genre })),
                },
            },
            include: {
                reviews: {
                    omit: {
                        userID: true,
                        filmID: true,
                    },
                },
                genres: {
                    omit: {
                        id: true,
                    },
                },
            },
        });
    };

    deleteFilmById = async (id: number): Promise<Film> => {
        log(`Deleting film with id ${id}...`);

        return this.#prisma.film.delete({
            where: {
                id: id,
            },
            include: {
                reviews: {
                    omit: {
                        userID: true,
                        filmID: true,
                    },
                },
                genres: {
                    omit: {
                        id: true,
                    },
                },
            },
        });
    };
}
