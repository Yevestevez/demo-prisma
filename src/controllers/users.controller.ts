import debug from 'debug';
import type { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import { env } from '../config/env.ts';
import type { UsersRepo } from '../repos/users.repo.ts';
import type {
    RegisterUserData,
    User,
    UserUpdateDTO,
} from '../zod/user.schemas.ts';
import { HttpError } from '../errors/http-error.ts';
import type { LoginResult } from '../types/login.ts';

const log = debug(`${env.PROJECT_NAME}:controller:users`);
log('Starting users controller...');

export class UsersController {
    #repo: UsersRepo;

    constructor(repo: UsersRepo) {
        this.#repo = repo;
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        log('Registering new user...');

        try {
            const userData: RegisterUserData = req.body;
            const newUser: User = await this.#repo.register(userData);

            res.status(201).json(newUser);
        } catch (error) {
            log('Error registering user: %O', error);

            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to register user',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        log('Logging User...');

        try {
            const loginData = req.body;
            const loginResult: LoginResult = await this.#repo.login(loginData);

            return res.json(loginResult);
        } catch (error) {
            log('Error logging in user: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    401,
                    'Unauthorized',
                    'Invalid email or password',
                    {
                        cause: error,
                    },
                );
                return next(finalError);
            } else {
                const finalError = new HttpError(
                    500,
                    'Internal Server Error',
                    'Failed to login user',
                    {
                        cause: error,
                    },
                );
                return next(finalError);
            }
        }
    };

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        log('Getting all users');

        try {
            const users: User[] = await this.#repo.getAllUsers();

            res.json(users);
        } catch (error) {
            const finalError = new HttpError(
                500,
                'Internal Server Error',
                'Failed to getting users',
                {
                    cause: error,
                },
            );

            return next(finalError);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Getting User with id ${id} from repo...`);

        try {
            const user: User = await this.#repo.getUserById(id);

            res.json(user);
        } catch (error) {
            log('Error getting user by id: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    `User with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            } else {
                const finalError = new HttpError(
                    500,
                    'Internal Server Error',
                    'Failed to login user',
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Updating User with id ${id} in repo...`);

        try {
            const userData: UserUpdateDTO = req.body;
            const updatedUser: User = await this.#repo.updateUserById(
                id,
                userData,
            );

            res.json(updatedUser);
        } catch (error) {
            log('Error updating user by id: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    `User with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            } else {
                const finalError = new HttpError(
                    500,
                    'Internal Server Error',
                    'Failed to login user',
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const id = Number(req.params.id);
        log(`Deleting User with id ${id} from repo...`);

        try {
            const deletedUser: User = await this.#repo.deleteUserById(id);

            res.json(deletedUser);
        } catch (error) {
            log('Error deleting user by id: %O', error);
            if (error instanceof PrismaClientKnownRequestError) {
                const finalError = new HttpError(
                    404,
                    'Not Found',
                    `User with id ${id} not found`,
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            } else {
                const finalError = new HttpError(
                    500,
                    'Internal Server Error',
                    'Failed to login user',
                    {
                        cause: error,
                    },
                );

                return next(finalError);
            }
        }
    };
}
