import { defineConfig } from 'vitest/config';

/**
 * Vitest keeps a focused config so the test runner does not load the application-only
 * React and Tailwind plugins. esbuild handles TSX in the component tests without them.
 */
export default defineConfig({
  test: {
    // Pure estimation and simulation logic needs no DOM; component tests opt in with a
    // `@vitest-environment jsdom` directive at the top of the file, so the logic tests
    // keep the fast default environment.
    environment: 'node',
    globals: false,
    restoreMocks: true,
    // The managed runners can report many host CPUs while enforcing a much smaller
    // CPU quota. Capping workers avoids resource starvation and flaky async timeouts.
    maxWorkers: 2,
    testTimeout: 20_000,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      // The estimation model and the simulation engines are the trust-critical,
      // contestable core of CrackLab; they carry the blocking coverage gate.
      // Datasets and UI are reviewed separately and stay outside this denominator.
      include: ['src/model/**/*.{ts,tsx}', 'src/sim/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.d.ts', 'src/**/data/**'],
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportOnFailure: true,
      thresholds: {
        // Roadmap Fase 0/1 gate: >= 80% on model/ and sim/. Keep changes explicit.
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 85,
        autoUpdate: false,
        // A well-tested large module must not mask an untested small one.
        perFile: { lines: 80, statements: 80, branches: 70, functions: 80 }
      }
    }
  }
});
