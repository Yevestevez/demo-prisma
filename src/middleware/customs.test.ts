import type { Request, Response, NextFunction } from 'express';
import { customHeaders } from './customs.ts';

describe('GIVEN customHeaders function', () => {
    describe('WHEN it is executed', () => {
        test('THEN it will call res.setHeader method and next function', () => {
            // Arrange
            const _req: Request = {};
            const res = {
                setHeader: vitest.fn(),
            } as unknown as Response;
            const next: NextFunction = vitest.fn();
            const project = '';
            // Act
            customHeaders(project);
            // Assert
            expect(res.setHeader).toHaveBeenCalledWith('', '');
            expect(next).not.toHaveBeenCalled();
        });
    });
});
