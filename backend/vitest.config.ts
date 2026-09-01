import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Vite 8 transforms with Oxc by default, which (like esbuild) does not emit
  // `emitDecoratorMetadata`. unplugin-swc sets `esbuild: false`, but that no longer
  // disables the default transform, so disable Oxc explicitly and let SWC (below) own it.
  oxc: false,
  esbuild: false,
  resolve: {
    // tsconfig.json declares the @/* aliases project-relative with no baseUrl, which is the
    // shape Vite's native resolution handles - so there is no alias list to keep in sync.
    tsconfigPaths: true,
  },
  plugins: [
    // routing-controllers / class-validator depend on `emitDecoratorMetadata`, which esbuild
    // (Vitest's default transform) does not emit. SWC does, so we transform with it instead.
    swc.vite({
      // The repo root .swcrc exists for the `build:swc` script and sets `module: commonjs`
      // plus its own baseUrl/paths. @swc/core reads it automatically and unplugin-swc does
      // not suppress it, which rewrites the @/* imports into broken relative requires.
      swcrc: false,
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
        target: 'es2022',
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    // The suites that boot the app import the whole source graph inside beforeAll, and SWC
    // transforms all of it on first import. That comfortably exceeds the 10s default on a
    // cold run.
    hookTimeout: 60_000,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/data-contracts/**', 'src/**/*.{test,spec}.ts', 'src/types/**', 'src/swagger-typescript-api.ts'],
    },
  },
});
