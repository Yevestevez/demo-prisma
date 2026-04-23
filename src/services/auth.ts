import { hash } from 'bcryptjs';
import debug from 'debug';

import { env } from '../config/env.ts';

const log = debug(`${env.PROJECT_NAME}:auth`);
log('Loading auth service...');

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthService {
    static hash(password: string): Promise<string> {
        return hash(password, 10);
    }
}
