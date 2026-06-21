import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/ax-dose-logger-card.ts',
  output: {
    file: 'dist/ax-dose-logger-card.js',
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
