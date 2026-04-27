import type { PrismaClient } from '../../generated/prisma/client.ts';
import type {
    FilmCreateInput,
    FilmUpdateInput,
} from '../../generated/prisma/models.ts';
import { env } from '../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:repo:films`);
log('Loading films repo...');

export class FilmsRepo {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    }

    getAllFilms = async () => {
        const result = await this.#prisma.film.findMany();

        if (result.length === 0) {
            throw new Error('Films Not Found');
        }

        return result;
    };

    getFilmById = async (id: number) => {
        const result = await this.#prisma.film.findUnique({
            where: {
                id: id,
            },
        });

        if (!result) {
            throw new Error('Film Not Found');
        }

        return result;
    };

    // TODO -> PERMISOS SOLO PARA ADMIN
    createFilm = async (filmData: FilmCreateInput) => {
        const result = await this.#prisma.film.create({
            data: filmData,
        });

        return result;
    };

    // TODO -> PERMISOS SOLO PARA ADMIN
    updateFilmById = async (id: number, filmData: FilmUpdateInput) => {
        const result = await this.#prisma.film.update({
            where: {
                id: id,
            },
            data: filmData,
        });

        return result;
    };

    // TODO-> PERMISOS SOLO PARA ADMIN
    deleteFilmById = async (id: number) => {
        const result = await this.#prisma.film.delete({
            where: {
                id: id,
            },
        });

        return result;
    };
}
