import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: './src/config/setup-test.ts',
        include: ['**/*.spec.ts'],
        // coverage: {
        //     include: ['src/**/*.ts'],
        //     exclude: [
        //         'src/index.ts',
        //         'src/**/entities/*.ts',
        //         'src/**/types/*.ts',
        //     ],
        // },
    },
});
