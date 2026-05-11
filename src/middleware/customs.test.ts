import type { Request, Response, NextFunction } from 'express';
import { customHeaders } from './customs.ts';

describe('GIVEN customHeaders function', () => {
    describe('WHEN it is executed', () => {
        test('THEN it will call res.setHeader method and next function', () => {
            // Arrange
            const _req = {} as Request;
            const res = {
                setHeader: vi.fn(),
            } as unknown as Response;
            const next = vi.fn() as NextFunction;
            const project = 'demo-prisma';
            const middleware = customHeaders(project);

            // Act
            middleware(_req, res, next);

            // Assert
            expect(res.setHeader).toHaveBeenCalledWith('X-Project', project);
            expect(next).toHaveBeenCalled();
        });
    });
});
