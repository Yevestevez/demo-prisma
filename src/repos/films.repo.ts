import debug from 'debug';

import { env } from '../config/env.ts';
import type { PrismaClient } from '../../generated/prisma/client.ts';

import {
    type Film,
    type FilmCreateDTO,
    type FilmUpdateDTO,
} from '../zod/film.schemas.ts';

const log = debug(`${env.PROJECT_NAME}:repo:films`);
log('Loading films repo...');

export class FilmsRepo {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    }

    getAllFilms = async (): Promise<Film[]> => {
        log('Getting al films...');

        return this.#prisma.film.findMany({
            include: {
                reviews: true,
                genres: true,
            },
        }) as Promise<Film[]>;
    };

    getFilmById = async (id: number): Promise<Film> => {
        log(`Getting film with id ${id}...`);

        return this.#prisma.film.findUnique({
            where: {
                id: id,
            },
        }) as Promise<Film>;
    };

    createFilm = async (filmData: FilmCreateDTO): Promise<Film> => {
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
        });

        return newFilm as Film;
    };

    updateFilmById = async (id: number, filmData: FilmUpdateDTO) => {
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
                    connect: filmData.genres.map((genre) => ({ name: genre })),
                },
            },
        }) as Promise<Film>;
    };

    deleteFilmById = async (id: number) => {
        log(`Deleting film with id ${id}...`);

        return this.#prisma.film.delete({
            where: {
                id: id,
            },
        }) as Promise<Film>;
    };
}
