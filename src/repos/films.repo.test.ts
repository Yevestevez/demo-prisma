import type { AppPrismaClient } from '../config/db-config.ts';
import { type Mock } from 'vitest';
import { FilmsRepo } from './films.repo.ts';
import type { FilmCreateDTO } from '../zod/film.schemas.ts';

describe('GIVEN a instance of <FilmsRepo> class', () => {
    let repo: FilmsRepo;
    let prismaMock: AppPrismaClient;

    beforeEach(() => {
        prismaMock = {
            film: {
                findMany: vitest.fn().mockResolvedValue([]),
                findUniqueOrThrow: vitest.fn().mockResolvedValue({}),
                create: vitest.fn().mockResolvedValue({}),
                update: vitest.fn().mockResolvedValue({}),
                delete: vitest.fn().mockResolvedValue({}),
            },
        } as unknown as AppPrismaClient;
        repo = new FilmsRepo(prismaMock);
    });

    afterEach(() => {
        vitest.clearAllMocks();
    });

    // Arrange

    describe('WHEN the instance is created', () => {
        test('THEN it should be an instance of FilmsRepo', () => {
            expect(repo).toBeInstanceOf(FilmsRepo);
        });
    });

    describe('WHEN method getAllFilms is called', () => {
        test('THEN it return the array of films', async () => {
            // Act
            const films = await repo.getAllFilms();
            // Assert
            expect(films).toEqual([]);
        });
    });

    describe('WHEN method getFilmById is called', () => {
        describe('AND the film with the given id exists', () => {
            test('THEN it return the film with the given id', async () => {
                // Act
                const film = await repo.getFilmById(1);
                // Assert
                expect(prismaMock.film.findUniqueOrThrow).toHaveBeenCalled();
                expect(film).toEqual({});
            });
            describe('AND the film with the given id does not exist', () => {
                test('THEN it should throw an error', async () => {
                    // Arrange
                    (
                        prismaMock.film.findUniqueOrThrow as Mock
                    ).mockRejectedValue(new Error('Film not found'));
                    // Act & Assert
                    await expect(repo.getFilmById(999)).rejects.toThrow(
                        'Film not found',
                    );
                });
            });
        });
    });

    describe('WHEN method createFilm is called', () => {
        test('THEN it should create a new film and return it', async () => {
            // Act
            const film = await repo.createFilm({} as FilmCreateDTO);
            // Assert
            //expect(prismaMock.film.create).toHaveBeenCalled();
            expect(film).toEqual({});
        });
    });

    describe('WHEN method updateFilm is called', () => {
        describe('AND the film with the given id exists', () => {
            test('THEN it should update the film and return it', async () => {
                // Act
                const film = await repo.updateFilmById(1, {} as FilmCreateDTO);
                // Assert
                expect(prismaMock.film.update).toHaveBeenCalled();
                expect(film).toEqual({});
            });
        });
        describe('AND the film with the given id does not exist', () => {
            test('THEN it should throw an error', async () => {
                // Arrange
                (prismaMock.film.update as Mock).mockRejectedValue(
                    new Error('Film not found'),
                );
                // Act & Assert
                await expect(
                    repo.updateFilmById(999, {} as FilmCreateDTO),
                ).rejects.toThrow('Film not found');
            });
        });
    });

    describe('WHEN method deleteFilm is called', () => {
        describe('AND the film with the given id exists', () => {
            test('THEN it should delete the film and return it', async () => {
                // Act
                const film = await repo.deleteFilmById(1);
                // Assert
                expect(prismaMock.film.delete).toHaveBeenCalled();
                expect(film).toEqual({});
            });
        });
        describe('AND the film with the given id does not exist', () => {
            test('THEN it should throw an error', async () => {
                // Arrange
                (prismaMock.film.delete as Mock).mockRejectedValue(
                    new Error('Film not found'),
                );
                // Act & Assert
                await expect(repo.deleteFilmById(999)).rejects.toThrow(
                    'Film not found',
                );
            });
        });
    });
});
