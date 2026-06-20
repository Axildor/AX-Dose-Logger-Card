import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/pill-logger-card.ts',
  output: {
    file: 'dist/pill-logger-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        outDir: 'dist',
        declaration: false,
        sourceMap: false,
      },
    }),
  ],
};
