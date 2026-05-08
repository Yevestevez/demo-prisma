import type { AppPrismaClient } from '../config/db-config.ts';
import { FilmsRepo } from './films.repo.ts';

describe('GIVEN a instance of <FilmsRepo> class', () => {
    // Arrange
    const prismaMock = {
        film: {
            findMany: vitest.fn().mockResolvedValue([]),
        },
    } as unknown as AppPrismaClient;
    const repo = new FilmsRepo(prismaMock);

    describe('WHEN method getAllFilms is called', () => {
        test.only('THEN ir return the array of films', async () => {
            // Act
            const films = await repo.getAllFilms();
            // Assert
            expect(films).toEqual([]);
        });
    });
});
