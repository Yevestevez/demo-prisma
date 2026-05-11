import type { Mock } from 'vitest';
import type { AppPrismaClient } from '../config/db-config.ts';
import { GenreRepo } from './genre.repo.ts';
import type { GenreCreateDTO, GenreUpdateDTO } from '../zod/film.schemas.ts';

describe('GIVEN an instance of <GenreRepo> class ', () => {
    let repo: GenreRepo;
    let prismaMock: AppPrismaClient;

    beforeEach(() => {
        prismaMock = {
            genre: {
                findMany: vitest.fn().mockResolvedValue([]),
                findUniqueOrThrow: vitest.fn().mockResolvedValue({}),
                create: vitest.fn().mockResolvedValue({}),
                update: vitest.fn().mockResolvedValue({}),
                delete: vitest.fn().mockResolvedValue({}),
            },
        } as unknown as AppPrismaClient;
        repo = new GenreRepo(prismaMock);
    });

    afterEach(() => {
        vitest.clearAllMocks();
    });

    describe('WHEN the instance is created', () => {
        test('THEN it should be an instance of <GenreRepo>', () => {
            expect(repo).toBeInstanceOf(GenreRepo);
        });
    });

    // describe: WHEN Método llamado
    // ? describe: y el ID existe o NO existe
    // test: THEN devuelve...

    describe('WHEN method <getAllGenres> is called', () => {
        test('THEN it returns the array of genres', async () => {
            const genres = await repo.getAllGenres();

            expect(prismaMock.genre.findMany).toHaveBeenCalled();
            expect(genres).toEqual([]);
        });
    });

    describe('WHEN method <getGenreById> is called', () => {
        describe('And the genre with the given id exists', () => {
            test('THEN it return the genre with the given id', async () => {
                const genre = await repo.getGenreById(1);

                expect(prismaMock.genre.findUniqueOrThrow).toHaveBeenCalled();
                expect(genre).toEqual({});
            });
        });

        describe('And the genre with the given id NOT exists', () => {
            test('THEN it throw an error ', async () => {
                (prismaMock.genre.findUniqueOrThrow as Mock).mockRejectedValue(
                    new Error('Genre not found'),
                );

                await expect(repo.getGenreById(999)).rejects.toThrow(
                    'Genre not found',
                );
                expect(prismaMock.genre.findUniqueOrThrow).toHaveBeenCalled();
            });
        });
    });

    describe('WHEN method <createGenre> is called', () => {
        test('THEN it return the created genre', async () => {
            const newGenre = (await repo.createGenre(
                'Action',
            )) as GenreCreateDTO;

            expect(prismaMock.genre.create).toHaveBeenCalled();
            expect(newGenre).toEqual({});
        });
    });

    describe('WHEN method <updateGenre> is called', () => {
        describe('And the genre with the given id exists', () => {
            test('THEN it return the updated genre', async () => {
                const updatedGenre = (await repo.updateGenre(
                    1,
                    'Action',
                )) as GenreUpdateDTO;

                expect(prismaMock.genre.update).toHaveBeenCalled();
                expect(updatedGenre).toEqual({});
            });
        });

        describe('And the genre with the given id NOT exists', () => {
            test('THEN it throw an error', async () => {
                (prismaMock.genre.update as Mock).mockRejectedValue(
                    new Error('Genre not found'),
                );

                await expect(
                    repo.updateGenre(999, 'Action') as GenreUpdateDTO,
                ).rejects.toThrow('Genre not found');
                expect(prismaMock.genre.update).toHaveBeenCalled();
            });
        });
    });

    describe('WHEN method <deleteGenre> is called', () => {
        describe('And the genre with the given id exits', () => {
            test('THEN it will return the deleted genre', async () => {
                const deletedGenre = await repo.deleteGenre(1);

                expect(prismaMock.genre.delete).toHaveBeenCalled();
                expect(deletedGenre).toEqual({});
            });
        });

        describe('And the genre with the given id exits', () => {
            test('THEN it will throw an error', async () => {
                (prismaMock.genre.delete as Mock).mockRejectedValue(
                    new Error('Genre not found'),
                );

                await expect(repo.deleteGenre(999)).rejects.toThrow(
                    'Genre not found',
                );
                expect(prismaMock.genre.delete).toHaveBeenCalled();
            });
        });
    });
});
