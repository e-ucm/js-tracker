// rollup.config.js
import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  input: 'src/js-tracker.js',
  output: [
    {
      file: 'dist/js-tracker.bundle.js',
      format: 'es',
    },
    {
      file: 'dist/js-tracker.bundle.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/js-tracker.bundle.min.js',
      format: 'es',
      plugins: [terser()],
    },
    {
      file: 'dist/js-tracker.bundle.min.cjs',
      format: 'cjs',
      plugins: [terser()],
    },
  ],
});
