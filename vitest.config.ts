import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: './src/config/setup-test.ts',
        include: ['**/*.test.ts', '**/*.test.tsx'],
        coverage: {
            include: ['src/**/*.ts'],
            exclude: [
                'src/index.ts',
                'src/**/entities/*.ts',
                'src/**/types/*.ts',
            ],
        },
    },
});
