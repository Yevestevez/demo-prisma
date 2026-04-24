import debug from 'debug';
import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.ts';
import type { UsersRepo } from '../repos/users-repo.ts';
import type {
    UserCreateInput,
    UserCreateWithoutProfileInput,
    UserCreateWithoutReviewsInput,
    UserUpdateInput,
} from '../../generated/prisma/models.ts';

const log = debug(`${env.PROJECT_NAME}:controller:users`);
log('Starting users controller...');

export class UsersController {
    #repo: UsersRepo;

    constructor(repo: UsersRepo) {
        this.#repo = repo;
    }

    async registerUser(req: Request, res: Response, next: NextFunction) {
        log('Registering new user...');

        try {
            const userData = req.body as UserCreateInput;
            const newUser = await this.#repo.register(userData);

            res.json(newUser);
            //TODO -> Mejorar el manejo de errores
        } catch (error) {
            next(error);

            return;
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        log('Logging User...');

        try {
            const userData = req.body as UserCreateWithoutProfileInput &
                UserCreateWithoutReviewsInput;
            const loggedUser = await this.#repo.login(userData);

            res.json(loggedUser);
        } catch (error) {
            next(error);

            return;
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const id = Number(req.params.id);
        log(`Getting User with id ${id} from repo...`);

        try {
            const user = await this.#repo.getUserById(id);

            res.json(user);
        } catch (error) {
            next(error);

            return;
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        const id = Number(req.params.id);
        log(`Updating User with id ${id} in repo...`);

        try {
            const userData = req.body as UserUpdateInput;
            const updatedUser = await this.#repo.updateUserById(id, userData);

            res.json(updatedUser);
        } catch (error) {
            next(error);

            return;
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const id = Number(req.params.id);
        log(`Deleting User with id ${id} from repo...`);

        try {
            const deletedUser = await this.#repo.deleteUserById(id);

            res.json(deletedUser);
        } catch (error) {
            next(error);

            return;
        }
    }
}
