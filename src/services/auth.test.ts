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

describe('Given method <hash> from class AuthService', () => {
    describe('When it is executed', () => {
        test('Then return a string', async () => {
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

describe('Given method <compare> from class AuthService', () => {
    describe('When it is executed with a valid password', () => {
        test('Then return true', async () => {
            // Arrange
            const password = '123456';
            const hash = await AuthService.hash(password);
            // Act
            const result = await AuthService.compare(password, hash);
            // Assert
            expect(result).toBe(true);
        });
    });
});

describe.todo('Given method <generateToken> from class AuthService', () => {
    //
});

describe.todo('Given method <verifyToken> from class AuthService', () => {
    //
});
