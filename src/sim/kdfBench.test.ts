import { argon2id, bcrypt, bcryptVerify, md5, sha256 } from 'hash-wasm';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PARAMS,
  LIMITS,
  SYNTHETIC_INPUT,
  clampParams,
  runsFor,
  slowdownFactor,
  timeAlgorithm
} from './kdfBench';
import type { Hasher, KdfTiming } from './kdfBench';

describe('clampParams', () => {
  it('caps memory, cost and iterations and forces single lane', () => {
    const p = clampParams({ bcryptCost: 99, argonMemoryKiB: 10 ** 9, argonIterations: 100, argonParallelism: 8 });
    expect(p.bcryptCost).toBe(LIMITS.bcryptCost[1]);
    expect(p.argonMemoryKiB).toBe(LIMITS.argonMemoryKiB[1]);
    expect(p.argonIterations).toBe(LIMITS.argonIterations[1]);
    expect(p.argonParallelism).toBe(1);
    expect(clampParams({ ...DEFAULT_PARAMS, bcryptCost: 1 }).bcryptCost).toBe(LIMITS.bcryptCost[0]);
  });
  it('rejects non-finite values', () => {
    expect(() => clampParams({ ...DEFAULT_PARAMS, bcryptCost: Number.NaN })).toThrow(RangeError);
  });
});

describe('timeAlgorithm', () => {
  it('averages over the declared runs using the injected clock', async () => {
    let calls = 0;
    const hasher: Hasher = async () => {
      calls += 1;
      return 'x';
    };
    let t = 0;
    const now = () => {
      const v = t;
      t += 400;
      return v;
    };
    const timing = await timeAlgorithm('md5', DEFAULT_PARAMS, hasher, now);
    expect(calls).toBe(runsFor('md5'));
    expect(timing.ms).toBeCloseTo(400 / 2000, 9);
    expect(timing.perSecond).toBeCloseTo(1000 / timing.ms, 6);
  });
  it('runs slow KDFs once', () => {
    expect(runsFor('bcrypt')).toBe(1);
    expect(runsFor('argon2id')).toBe(1);
  });
});

describe('slowdownFactor', () => {
  const t = (algorithm: KdfTiming['algorithm'], ms: number): KdfTiming => ({
    algorithm,
    ms,
    runs: 1,
    perSecond: 1000 / ms
  });
  it('is the slowest/fastest ratio', () => {
    expect(slowdownFactor([t('md5', 0.01), t('bcrypt', 100)])).toBeCloseTo(10000);
  });
  it('is null with fewer than two timings', () => {
    expect(slowdownFactor([t('md5', 1)])).toBeNull();
  });
});

describe('real cryptography on the synthetic input', () => {
  const salt = new Uint8Array(16).fill(7);
  it('computes known digests', async () => {
    expect(await md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(await sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
  it('bcrypt verifies and a salt changes the output', async () => {
    const a = await bcrypt({ password: SYNTHETIC_INPUT, salt, costFactor: 4, outputType: 'encoded' });
    const b = await bcrypt({
      password: SYNTHETIC_INPUT,
      salt: new Uint8Array(16).fill(8),
      costFactor: 4,
      outputType: 'encoded'
    });
    expect(a).not.toBe(b);
    expect(await bcryptVerify({ password: SYNTHETIC_INPUT, hash: a })).toBe(true);
    expect(await bcryptVerify({ password: 'other', hash: a })).toBe(false);
  });
  it('Argon2id cost grows with memory/time and encodes its parameters', async () => {
    const run = async (memorySize: number) => {
      const s = performance.now();
      const h = await argon2id({
        password: SYNTHETIC_INPUT,
        salt,
        parallelism: 1,
        iterations: 2,
        memorySize,
        hashLength: 32,
        outputType: 'encoded'
      });
      return { h, ms: performance.now() - s };
    };
    const small = await run(64);
    const big = await run(32 * 1024);
    expect(small.h).toContain('$argon2id$v=19$m=64,t=2,p=1$');
    expect(big.h).toContain('m=32768,t=2,p=1');
    expect(big.ms).toBeGreaterThan(small.ms);
  });
});

describe('hasher (hash-wasm, synthetic input)', () => {
  it('produces the expected formats for every algorithm', async () => {
    const { hasher } = await import('./kdfHasher');
    const salt = new Uint8Array(16).fill(1);
    const fast = { ...DEFAULT_PARAMS, bcryptCost: 4, argonMemoryKiB: 64 };
    expect(await hasher('md5', fast, salt)).toMatch(/^[0-9a-f]{32}$/);
    expect(await hasher('sha256', fast, salt)).toMatch(/^[0-9a-f]{64}$/);
    expect(await hasher('bcrypt', fast, salt)).toMatch(/^\$2[aby]\$04\$/);
    expect(await hasher('argon2id', fast, salt)).toContain('$argon2id$');
  });
});
