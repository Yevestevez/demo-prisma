import type { Mock } from 'vitest';
import type { AppPrismaClient } from '../config/db-config.ts';
import type {
    LoginUserDTO,
    ProfileUpdateDTO,
    RegisterUserDTO,
    UserUpdateDTO,
} from '../schemas/users/user.dto.ts';
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
                delete: vi.fn().mockResolvedValue({}),
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
                } as LoginUserDTO);

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

    describe('WHEN method <getAllUsers> is called', () => {
        test('THEN it should return users array', async () => {
            const users = await repo.getAllUsers();

            expect(prismaMock.user.findMany).toHaveBeenCalled();
            expect(users).toEqual([]);
        });
    });

    describe('WHEN method <getUserById> is called', () => {
        describe('And the user with given id exists', () => {
            test('THEN it should return the user', async () => {
                const user = await repo.getUserById(1);

                expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalled();
                expect(user).toEqual({});
            });
        });

        describe('And the user with given id does NOT exists', () => {
            test('THEN it should throw an error', async () => {
                (
                    prismaMock.user.findUniqueOrThrow as Mock
                ).mockRejectedValueOnce(new Error('User not found'));

                await expect(repo.getUserById(999)).rejects.toThrow(
                    'User not found',
                );
            });
        });
    });

    describe('WHEN method <updateUserById> is called', () => {
        describe('And the user with given id exists', () => {
            test('THEN it should return the updated user', async () => {
                const updatedUser = await repo.updateUserById(1, {
                    password: '123456',
                } as UserUpdateDTO);

                expect(prismaMock.user.update).toHaveBeenCalled();
                expect(updatedUser).toEqual({} as User);
            });
        });

        describe('And the user with given id does NOT exists', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.user.update as Mock).mockRejectedValueOnce(
                    new Error('User not found'),
                );

                await expect(
                    repo.updateUserById(999, { password: '123456' }),
                ).rejects.toThrow('User not found');
            });
        });
    });

    describe('WHEN method <updateUserProfile> is called', () => {
        describe('And the user with given id exists', () => {
            test('THEN it should return the updated user', async () => {
                const updatedUser = await repo.updateUserProfile(
                    1,
                    {} as ProfileUpdateDTO,
                );

                expect(prismaMock.user.update).toHaveBeenCalled();
                expect(updatedUser).toEqual({} as User);
            });
        });

        describe('And the user with given id does NOT exists', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.user.update as Mock).mockRejectedValueOnce(
                    new Error('User not found'),
                );

                await expect(
                    repo.updateUserProfile(999, {} as ProfileUpdateDTO),
                ).rejects.toThrow('User not found');
            });
        });
    });

    describe('WHEN method <deleteUserById> is called', () => {
        describe('And the user with given id exists', () => {
            test('THEN it should return the deleted user', async () => {
                const deletedUser = await repo.deleteUserById(1);

                expect(prismaMock.user.delete).toHaveBeenCalled();
                expect(deletedUser).toEqual({} as User);
            });
        });

        describe('And the user with given id does NOT exists', () => {
            test('THEN it should throw an error', async () => {
                (prismaMock.user.delete as Mock).mockRejectedValueOnce(
                    new Error('User not found'),
                );

                await expect(repo.deleteUserById(999)).rejects.toThrow(
                    'User not found',
                );
            });
        });
    });
});
