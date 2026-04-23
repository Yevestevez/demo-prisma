import type { PrismaClient } from '../../generated/prisma/client.ts';
import type { UserCreateInput } from '../../generated/prisma/models.ts';
import { env } from '../config/env.ts';
import debug from 'debug';

const log = debug(`${env.PROJECT_NAME}:repo:users`);
log('Loading users repo...');

export class UsersRepo {
    #prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma;
    }

    register = async (userData: UserCreateInput) => {
        log('userData:', userData);
        const result = await this.#prisma.user.create({
            data: userData,
            omit: {
                password: true,
            },
        });

        return result.email;
    };
}
