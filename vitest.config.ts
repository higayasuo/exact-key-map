import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname),
  test: {
    include: ['src/**/__tests__/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/**/__tests__/**',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
    environment: 'node',
    globals: false,
  },
});
