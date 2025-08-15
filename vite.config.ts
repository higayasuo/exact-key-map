import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ExactKeyMap',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      outDir: 'dist',
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['src/**/__tests__/**', 'src/**/*.spec.ts', 'src/**/*.test.ts'],
    }),
  ],
});


