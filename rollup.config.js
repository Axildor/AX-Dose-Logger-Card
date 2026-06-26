import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/ax-dose-logger-card.ts',
  output: {
    file: 'dist/ax-dose-logger-card.js',
    format: 'es',
    sourcemap: false,
  },
  // Silence the known-harmless THIS_IS_UNDEFINED warning from @formatjs/intl-utils
  // (transitive dep via custom-card-helpers → formatTime/formatDateTime). The flagged
  // top-level `this` references are dead code — Object.assign / Object.setPrototypeOf
  // are universally available in browsers, so the hand-rolled fallbacks never run.
  onwarn(warning, defaultHandler) {
    if (
      warning.code === 'THIS_IS_UNDEFINED' &&
      warning.id &&
      warning.id.includes('@formatjs/intl-utils')
    ) {
      return;
    }
    defaultHandler(warning);
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
