import type { PrismaClient } from '../../generated/prisma/client.ts';
import type {
    UserCreateInput,
    UserCreateWithoutProfileInput,
    UserCreateWithoutReviewsInput,
    UserUpdateInput,
} from '../../generated/prisma/models.ts';
import { env } from '../config/env.ts';
import debug from 'debug';
import { AuthService } from '../services/auth.ts';
import { compare } from 'bcryptjs';

const log = debug(`${env.PROJECT_NAME}:repo:users`);
log('Loading users repo...');

export class UsersRepo {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    }

    register = async (userData: UserCreateInput) => {
        userData.password = await AuthService.hash(userData.password);
        const result = await this.#prisma.user.create({
            data: userData,
            include: {
                profile: true,
            },
            omit: {
                password: true,
            },
        });

        return result.email;
    };

    login = async (
        userData: UserCreateWithoutProfileInput & UserCreateWithoutReviewsInput,
    ) => {
        const loginError = new Error('Invalid Login');
        const result = await this.#prisma.user.findUnique({
            where: {
                email: userData.email,
            },
        });

        if (!result) {
            throw loginError;
        }

        const isValid = await compare(userData.password, result.password);

        if (!isValid) {
            throw loginError;
        }

        return {
            id: result.id,
            email: result.email,
        };
    };

    getUserById = async (id: number) => {
        const result = await this.#prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                profile: true,
            },
            omit: {
                password: true,
            },
        });

        if (!result) {
            throw new Error('User Not Found');
        }

        return result;
    };

    // TODO -> PERMISOS SOLO A USER
    updateUserById = async (id: number, userData: UserUpdateInput) => {
        const result = await this.#prisma.user.update({
            where: {
                id: id,
            },
            include: {
                profile: true,
            },
            data: userData,
            omit: {
                password: true,
            },
        });

        return result;
    };

    // TODO-> PERMISOS SOLO A USER Y ADMIN
    deleteUserById = async (id: number) => {
        const result = await this.#prisma.user.delete({
            where: {
                id: id,
            },
            omit: {
                password: true,
            },
        });

        return result;
    };
}
