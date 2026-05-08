import type { TokenPayload } from '../types/login.ts';
import { AuthService } from './auth.ts';

// vitest.mock('zod', () => {
//     return {
//         object: vitest.fn().mockReturnValue({
//             parse: vitest.fn().mockReturnValue({ SALT_ROUNDS: 1 }),
//         }),
//         coerce: {
//             number: vitest.fn(),
//         },
//         enum: vitest.fn(),
//         string: vitest
//             .fn()
//             .mockReturnValue({ optional: vitest.fn(), min: vitest.fn() }),
//     };
// });

describe('GIVEN method <hash> from class AuthService', () => {
    describe('WHEN it is executed', () => {
        test('THEN it will return a string', async () => {
            // Arrange
            const password = '123456';
            // Act
            const hash = await AuthService.hash(password);
            // Assert
            expect(hash).toBeTypeOf('string');
            expect(hash.length).toBeGreaterThan(password.length);
        });
    });
});

describe('GIVEN method <compare> from class AuthService', () => {
    describe('WHEN it is executed with a valid password', () => {
        test('THEN it will return true', async () => {
            // Arrange
            const password = '123456';
            const hash = await AuthService.hash(password);
            // Act
            const result = await AuthService.compare(password, hash);
            // Assert
            expect(result).toBe(true);
        });
    });

    describe('WHEN it is executed with an invalid password', () => {
        test('THEN it will return false', async () => {
            // Arrange
            const password = '123456';
            const hash = await AuthService.hash('Invalid password');
            // Act
            const result = await AuthService.compare(password, hash);
            // Assert
            expect(result).toBe(false);
        });
    });
});

describe('GIVEN method <generateToken> from class AuthService', () => {
    describe('WHEN it is executed', () => {
        test('THEN ot will return a token (string)', async () => {
            // Arrange
            const payloadMock = {} as TokenPayload;
            const algToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            // Act
            const result = await AuthService.generateToken(payloadMock);
            // Assert
            expect(result).toBeTypeOf('string');
            expect(result).toContain(algToken);
        });
    });
});

describe('GIVEN method <generateTokenAsync> from class AuthService', () => {
    describe('WHEN it is executed', () => {
        test('THEN ot will return a token (string)', async () => {
            // Arrange
            const payloadMock = {} as TokenPayload;
            const algToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            // Act
            const result = await AuthService.generateTokenAsync(payloadMock);
            // Assert
            expect(result).toBeTypeOf('string');
            expect(result).toContain(algToken);
        });
    });
});

describe('GIVEN method <verifyToken> from class AuthService', () => {
    describe('WHEN it is executed with a valid token', () => {
        test('THEN it will return a token payload (object)', async () => {
            // Arrange
            const payloadMock = { id: 12 } as TokenPayload;
            const token = await AuthService.generateToken(payloadMock);
            // Act
            const { iat, ...result } = await AuthService.verifyToken(token);
            // Assert
            expect(iat).toBeTypeOf('number');
            expect(result).toEqual(payloadMock);
        });
    });

    describe('WHEN it is executed with an invalid token', () => {
        test('THEN it will throw an error', async () => {
            // Arrange
            const badToken = 'Invalid token';
            // Act & Assert
            expect(() => AuthService.verifyToken(badToken)).toThrow();
        });
    });
});

describe('GIVEN method <verifyTokenAsync> from class AuthService', () => {
    describe('WHEN it is executed with a valid token', () => {
        test('THEN it will return a token payload (object)', async () => {
            // Arrange
            const payloadMock = { id: 12 } as TokenPayload;
            const token = await AuthService.generateTokenAsync(payloadMock);
            // Act
            const { iat, ...result } = await AuthService.verifyToken(token);
            // Assert
            expect(iat).toBeTypeOf('number');
            expect(result).toEqual(payloadMock);
        });
    });

    describe('WHEN it is executed with an invalid token', () => {
        test('THEN it will reject the promise', async () => {
            // Arrange
            const badToken = 'Invalid token';
            // Act & Assert
            expect(() =>
                AuthService.verifyTokenAsync(badToken),
            ).rejects.toThrow();
        });
    });
});
