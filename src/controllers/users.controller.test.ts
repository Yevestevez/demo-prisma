import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import type { UsersRepo } from '../repos/users.repo.ts';
import { UsersController } from './users.controller.ts';
import type {
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
} from '../errors/http-error.ts';

describe('GIVEN <UsersController> class', () => {
    let repo: UsersRepo;
    let controller: UsersController;

    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(async () => {
        repo = {} as UsersRepo;
        controller = new UsersController(repo);

        req = {} as Request;
        res = {
            status: vi.fn().mockImplementation(() => res),
            json: vi.fn(),
            send: vi.fn(),
        } as unknown as Response;
        next = vi.fn() as NextFunction;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('WHEN it is instantiated', () => {
        test('THEN it should be an instance of <UsersController>', () => {
            expect(controller).toBeInstanceOf(UsersController);
        });
    });

    describe('WHEN method <getAllUsers> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with a list of users', async () => {
                repo.getAllUsers = vi.fn().mockResolvedValueOnce([]);

                await controller.getAllUsers(req, res, next);

                expect(repo.getAllUsers).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throws an error', () => {
            test('THEN it should call <next> with an <InternalServerError>', async () => {
                repo.getAllUsers = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getAllUsers(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <getUserById> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call json with a user', async () => {
                const mockUser = { id: 1 };
                req.params = { id: '1' };
                repo.getUserById = vi.fn().mockResolvedValueOnce(mockUser);

                await controller.getUserById(req, res, next);

                expect(repo.getUserById).toHaveBeenCalledWith(1);
                expect(res.json).toHaveBeenCalledWith(mockUser);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN it should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                repo.getUserById = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.getUserById(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                repo.getUserById = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.getUserById(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <register> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <status> with 201 and <json> with the new user', async () => {
                const mockUser = { id: 1 };
                req.body = { name: 'Any name', email: 'any@example.com' };
                repo.register = vi.fn().mockResolvedValueOnce(mockUser);

                await controller.register(req, res, next);

                expect(repo.register).toHaveBeenCalledWith(req.body);
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith(mockUser);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throws an error', () => {
            test('THEN it should call <next> with an <InternalServerError>', async () => {
                req.body = { name: 'Any name', email: 'any@example.com' };
                repo.register = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.register(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <login> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with login result', async () => {
                const loginResult = {
                    payload: { id: 1, email: 'any@example.com', role: 'USER' },
                    token: 'token',
                };
                req.body = {
                    email: 'any@example.com',
                    password: 'Any-password-123',
                };
                repo.login = vi.fn().mockResolvedValueOnce(loginResult);

                await controller.login(req, res, next);

                expect(repo.login).toHaveBeenCalledWith(req.body);
                expect(res.json).toHaveBeenCalledWith(loginResult);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throws a Prisma error', () => {
            test('THEN it should <next> with <UnauthorizedError>', async () => {
                req.body = {
                    email: 'any@example.com',
                    password: 'Any-password-123',
                };
                repo.login = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.login(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as UnauthorizedError),
                );
            });
        });

        describe('And repo throws a generic error', () => {
            test('THEN it should <next> with <InternalServerError>', async () => {
                req.body = {
                    email: 'any@example.com',
                    password: 'Any-password-123',
                };
                repo.login = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.login(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <updateUser> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <json> with the updated user', async () => {
                const mockUser = { id: 1 };
                req.params = { id: '1' };
                req.body = { email: 'updated@example.com' };
                repo.updateUserById = vi.fn().mockResolvedValueOnce(mockUser);

                await controller.updateUser(req, res, next);

                expect(repo.updateUserById).toHaveBeenCalledWith(1, req.body);
                expect(res.json).toHaveBeenCalledWith(mockUser);
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN it should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                req.body = { email: 'updated@example.com' };
                repo.updateUserById = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.updateUser(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                req.body = { email: 'updated@example.com' };
                repo.updateUserById = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.updateUser(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });

    describe('WHEN method <deleteUser> is called', () => {
        describe('And repo return valid data', () => {
            test('THEN it should call <status> with 204 and <send>', async () => {
                req.params = { id: '1' };
                repo.deleteUserById = vi.fn().mockResolvedValueOnce({ id: 1 });

                await controller.deleteUser(req, res, next);

                expect(repo.deleteUserById).toHaveBeenCalledWith(1);
                expect(res.status).toHaveBeenCalledWith(204);
                expect(res.send).toHaveBeenCalled();
                expect(next).not.toHaveBeenCalled();
            });
        });

        describe('And repo throw a Prisma error', () => {
            test('THEN it should <next> with <NotFoundError>', async () => {
                req.params = { id: '1' };
                repo.deleteUserById = vi.fn().mockRejectedValueOnce(
                    new PrismaClientKnownRequestError('Any message', {
                        code: 'P2025',
                        clientVersion: '1',
                    }),
                );

                await controller.deleteUser(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as NotFoundError),
                );
            });
        });

        describe('And repo throw a generic error', () => {
            test('THEN it should <next> with <InternalServerError>', async () => {
                req.params = { id: '1' };
                repo.deleteUserById = vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Any message'));

                await controller.deleteUser(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });
});
