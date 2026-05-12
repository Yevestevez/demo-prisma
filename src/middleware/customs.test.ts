import type { Request, Response, NextFunction } from 'express';
import { customHeaders } from './customs.ts';

describe('GIVEN <customHeaders> middleware factory function', () => {
    describe('WHEN the middleware it is created and executed', () => {
        test('THEN it will call <res.setHeader> method and <next> function without arguments', () => {
            // Arrange
            const _req = {} as Request;
            const res = {
                setHeader: vi.fn(),
            } as unknown as Response;
            const next: NextFunction = vi.fn();

            const project = 'demo-prisma';
            const middleware = customHeaders(project);

            // Act
            middleware(_req, res, next);

            // Assert
            expect(res.setHeader).toHaveBeenCalledWith('X-Project', project);
            expect(next).toHaveBeenCalledWith();
        });
    });
});
