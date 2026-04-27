import debug from 'debug';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import { env } from '../config/env.ts';
import type { AppPrismaClient } from '../config/db-config.ts';
import type {
    LoginUserData,
    ProfileDTO,
    RegisterUserData,
    User,
    UserUpdateDTO,
} from '../zod/user.schemas.ts';
import { AuthService } from '../services/auth.ts';
import type { LoginResult, TokenPayload } from '../types/login.ts';

const log = debug(`${env.PROJECT_NAME}:repo:users`);
log('Loading users repo...');

export class UsersRepo {
    #prisma: AppPrismaClient;

    constructor(prisma: AppPrismaClient) {
        this.#prisma = prisma;
    }

    register = async (userData: RegisterUserData): Promise<User> => {
        log(`Registering user with email ${userData.email}`);

        const hashedPassword = await AuthService.hash(userData.password);
        const registeredUser = await this.#prisma.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                role: Role.USER,
                profile: {
                    create: userData.profile,
                },
            },
            include: {
                profile: true,
            },
        });

        return registeredUser as User;
    };

    login = async (userData: LoginUserData): Promise<LoginResult> => {
        log(`Logging in user with email ${userData.email}`);

        const result = await this.#prisma.user.findUniqueOrThrow({
            where: { email: userData.email },
            omit: { password: false },
        });

        const isValid = await AuthService.compare(
            userData.password,
            result.password,
        );

        if (!isValid) {
            throw new PrismaClientKnownRequestError(
                'Invalid user or password',
                {
                    code: 'P2004',
                    clientVersion: '',
                },
            );
        }

        const payload: TokenPayload = {
            id: result.id,
            email: result.email,
            role: result.role,
        };
        const token = AuthService.generateToken(payload);

        return { payload, token };
    };

    getAllUsers = async (): Promise<User[]> => {
        log('Getting all users');

        return this.#prisma.user.findMany({
            include: { profile: true },
        }) as Promise<User[]>;
    };

    getUserById = async (id: number): Promise<User> => {
        log(`Getting user with id ${id}`);

        return this.#prisma.user.findUniqueOrThrow({
            where: { id },
            include: { profile: true },
        }) as Promise<User>;
    };

    updateUserById = async (
        id: number,
        userData: UserUpdateDTO,
    ): Promise<User> => {
        log(`Updating user with id ${id}`);

        return this.#prisma.user.update({
            where: { id },
            data: {
                ...userData,
                ...(userData.password && {
                    password: await AuthService.hash(userData.password),
                }),
            },
            include: { profile: true },
        }) as Promise<User>;
    };

    updateUserProfile = async (
        id: number,
        profileData: ProfileDTO,
    ): Promise<User> => {
        log(`Updating user profile with id ${id}`);

        return this.#prisma.user.update({
            where: { id: id },
            data: {
                profile: { update: profileData },
            },
            include: { profile: true },
        }) as Promise<User>;
    };

    deleteUserById = async (id: number): Promise<User> => {
        log(`Deleting user with id ${id}`);

        return this.#prisma.user.delete({
            where: { id: id },
        }) as Promise<User>;
    };
}
