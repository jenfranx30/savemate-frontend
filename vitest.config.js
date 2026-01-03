import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTestsFrontend.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/setupTestsFrontend.js',
        '**/*.config.js',
        '**/vite-env.d.ts',
      ],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});