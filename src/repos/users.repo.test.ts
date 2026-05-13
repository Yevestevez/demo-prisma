import type { Mock } from 'vitest';
import type { AppPrismaClient } from '../config/db-config.ts';
import type { RegisterUserDTO } from '../schemas/users/user.dto.ts';
import type { User } from '../schemas/users/user.schema.ts';
import { AuthService } from '../services/auth.ts';
import { UsersRepo } from './users.repo.ts';
import type { TokenPayload } from '../types/login.ts';

describe('GIVEN an instance of <UsersRepo> class', () => {
    let prismaMock: AppPrismaClient;
    let repo: UsersRepo;

    beforeEach(() => {
        prismaMock = {
            user: {
                findMany: vi.fn().mockResolvedValue([]),
                findUniqueOrThrow: vi.fn().mockResolvedValue({}),
                create: vi.fn().mockResolvedValue({}),
                update: vi.fn().mockResolvedValue({}),
                delete: vi.fn().mockRejectedValue({}),
            },
        } as unknown as AppPrismaClient;

        repo = new UsersRepo(prismaMock);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('WHEN the instance is created', () => {
        test('THEN it should be an instance of <UsersRepo>', () => {
            expect(repo).toBeInstanceOf(UsersRepo);
        });
    });

    describe('WHEN <register> method is called', () => {
        test('It should return the new created user', async () => {
            vi.spyOn(AuthService, 'hash').mockResolvedValue('Hashed password');

            const newUser = await repo.register({} as RegisterUserDTO);

            expect(AuthService.hash).toHaveBeenCalled();
            expect(newUser).toEqual({} as User);
        });
    });

    describe('WHEN <login> method is called', () => {
        describe('And the user data is valid', () => {
            test('THEN return the login result', async () => {
                (
                    prismaMock.user.findUniqueOrThrow as Mock
                ).mockResolvedValueOnce({
                    id: 1,
                    email: 'test@email.com',
                    password: 'hashed-password',
                    role: 'USER',
                });

                vi.spyOn(AuthService, 'compare').mockResolvedValueOnce(true);

                const result = await repo.login({
                    email: 'test@email.com',
                    password: '123456',
                });

                expect(result.payload).toEqual({
                    email: 'test@email.com',
                    id: 1,
                    role: 'USER',
                } as TokenPayload);
            });
        });

        describe('And the user data is NOT valid', () => {
            test('THEN it throw and error', async () => {
                (
                    prismaMock.user.findUniqueOrThrow as Mock
                ).mockResolvedValueOnce({
                    id: 1,
                    email: 'test@email.com',
                    password: await AuthService.hash('123456'),
                    role: 'USER',
                });

                vi.spyOn(AuthService, 'compare').mockResolvedValueOnce(false);

                await expect(
                    repo.login({
                        email: 'test@email.com',
                        password: '123456',
                    }),
                ).rejects.toThrow('Invalid user or password');
            });
        });
    });
});
