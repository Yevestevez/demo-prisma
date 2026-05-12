import type { Request, Response, NextFunction } from 'express';
import { AuthInterceptor } from './auth.interceptor.ts';
import { UnauthorizedError } from '../errors/http-error.ts';
import { AuthService } from '../services/auth.ts';
import type { TokenPayload } from '../types/login.ts';

describe('GIVEN a instance of <AuthInterceptor> class', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    let authInterceptor: AuthInterceptor;

    beforeEach(() => {
        req = {
            header: vi.fn().mockReturnValueOnce('Bearer token'),
        } as unknown as Request;
        res = {
            setHeader: vi.fn(),
        } as unknown as Response;
        next = vi.fn();

        authInterceptor = new AuthInterceptor();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('And <authenticate> method is call', () => {
        describe('WHEN the user data is OK', () => {
            test('THEN <next> will be called without arguments', async () => {
                vi.spyOn(AuthService, 'verifyTokenAsync').mockResolvedValue({
                    id: '1',
                } as unknown as TokenPayload);

                await authInterceptor.authenticate(req, res, next);

                expect(AuthService.verifyTokenAsync).toHaveBeenCalled();
                expect(req.user).toStrictEqual({ id: '1' });
                expect(next).toHaveBeenCalledWith();
            });
        });

        describe('WHEN <req> has NOT authorization header', () => {
            test('THEN <next> will be called with <UnauthorizedError>', async () => {
                req.header = vi.fn();

                await authInterceptor.authenticate(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as UnauthorizedError),
                );
            });
        });

        describe('WHEN <req> header has NOT Bearer', () => {
            test('THEN <next> will be called with <UnauthorizedError>', async () => {
                req.header = vi.fn().mockReturnValue('NO_Bearer token');

                await authInterceptor.authenticate(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as UnauthorizedError),
                );
            });
        });

        describe('WHEN <req> have authorization header with NOT valid token', () => {
            test('THEN <next> will be called with <UnauthorizedError>', async () => {
                vi.spyOn(AuthService, 'verifyTokenAsync').mockRejectedValueOnce(
                    new Error('Error'),
                );

                await authInterceptor.authenticate(req, res, next);

                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as UnauthorizedError),
                );
            });
        });
    });
});
