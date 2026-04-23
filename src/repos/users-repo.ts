import type { PrismaClient } from '../../generated/prisma/client.ts';
import type {
    UserCreateInput,
    UserCreateWithoutProfileInput,
    UserCreateWithoutReviewsInput,
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
        const result = await this.#prisma.user.findUnique({
            where: {
                email: userData.email,
            },
        });

        if (!result) {
            throw new Error('User not found');
        }

        const isValid = await compare(userData.password, result.password);

        if (!isValid) {
            throw new Error('Invalid password');
        }

        return {
            id: result.id,
            email: result.email,
        };
    };
}
