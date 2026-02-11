import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.js',
      ],
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
