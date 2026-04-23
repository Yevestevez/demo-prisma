import type { PrismaClient } from '../../generated/prisma/client.ts';
import type { UserCreateInput } from '../../generated/prisma/models.ts';
import { env } from '../config/env.ts';
import debug from 'debug';
import { AuthService } from '../services/auth.ts';

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
}
