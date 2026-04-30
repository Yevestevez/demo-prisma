import debug from 'debug';

import { env } from '../config/env.ts';
import type { AppPrismaClient } from '../config/db-config.ts';
import type {
    Genre,
    GenreCreateDTO,
    GenreDetail,
    GenreUpdateDTO,
} from '../zod/film.schemas.ts';

const log = debug(`${env.PROJECT_NAME}:repo:genres`);
log('Loading genres repo...');

export class GenreRepo {
    #prisma: AppPrismaClient;

    constructor(prisma: AppPrismaClient) {
        this.#prisma = prisma;
    }

    getAllGenres = async (): Promise<Genre[]> => {
        log('Getting all genres...');
        return await this.#prisma.genre.findMany();
    };

    getGenreById = async (id: number): Promise<GenreDetail> => {
        log(`Getting genre with id ${id}...`);

        return await this.#prisma.genre.findUniqueOrThrow({
            where: { id },
            include: {
                films: {
                    include: {
                        genres: {
                            omit: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });
    };

    createGenre = async (name: GenreCreateDTO['name']): Promise<Genre> => {
        log(`Creating genre with name ${name}...`);

        return await this.#prisma.genre.create({
            data: { name },
        });
    };

    updateGenre = async (
        id: number,
        name: GenreUpdateDTO['name'],
    ): Promise<Genre> => {
        log(`Updating genre with id ${id}...`);

        return await this.#prisma.genre.update({
            where: { id },
            data: { name },
        });
    };

    deleteGenre = async (id: number): Promise<Genre> => {
        log(`Deleting genre with id ${id}...`);

        return await this.#prisma.genre.delete({
            where: { id },
        });
    };
}
