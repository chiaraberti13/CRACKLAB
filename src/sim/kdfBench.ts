import type { Algorithm } from '../model/types';

/**
 * Local KDF cost lab. It really executes each algorithm on a fixed SYNTHETIC
 * string (never the user's sample) and times it. The result is a `measured`
 * single-run timing on this device: it says how costly ONE verification is here,
 * not how fast an attacker's hardware is. Parameters mirror benchmarks.json.
 */

export const SYNTHETIC_INPUT = 'cracklab-synthetic-demo-input';

/** Guardrails: memory is bounded by the fixed Argon2id params; time by a deadline. */
export const KDF_TIMEOUT_MS = 8000;

export interface KdfParams {
  bcryptCost: number;
  argonMemoryKiB: number;
  argonIterations: number;
  argonParallelism: number;
}

/** Same parameters as the dataset rows (bcrypt cost 12, Argon2id m=19MiB t=2 p=1). */
export const DEFAULT_PARAMS: KdfParams = {
  bcryptCost: 12,
  argonMemoryKiB: 19 * 1024,
  argonIterations: 2,
  argonParallelism: 1
};

/** Hard caps so a tampered call can never exhaust a phone's memory or time. */
export const LIMITS = { bcryptCost: [4, 14], argonMemoryKiB: [8, 64 * 1024], argonIterations: [1, 6] } as const;

export interface KdfTiming {
  algorithm: Algorithm;
  /** Wall-clock milliseconds of one hash on this device (mean of `runs`). */
  ms: number;
  runs: number;
  /** Derived: single-thread hashes/s implied by `ms`. */
  perSecond: number;
}

export type Hasher = (algorithm: Algorithm, params: KdfParams, salt: Uint8Array) => Promise<string>;

/** Runs per algorithm: fast hashes are repeated so the timer resolution is meaningful. */
export function runsFor(algorithm: Algorithm): number {
  return algorithm === 'md5' || algorithm === 'sha256' ? 2000 : 1;
}

function clamp(value: number, [min, max]: readonly [number, number]): number {
  if (!Number.isFinite(value)) throw new RangeError('Parameter must be a finite number.');
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function clampParams(p: KdfParams): KdfParams {
  return {
    bcryptCost: clamp(p.bcryptCost, LIMITS.bcryptCost),
    argonMemoryKiB: clamp(p.argonMemoryKiB, LIMITS.argonMemoryKiB),
    argonIterations: clamp(p.argonIterations, LIMITS.argonIterations),
    argonParallelism: 1
  };
}

export async function timeAlgorithm(
  algorithm: Algorithm,
  params: KdfParams,
  hasher: Hasher,
  now: () => number = () => performance.now(),
  salt: Uint8Array = new Uint8Array(16)
): Promise<KdfTiming> {
  const safe = clampParams(params);
  const runs = runsFor(algorithm);
  const start = now();
  for (let i = 0; i < runs; i += 1) await hasher(algorithm, safe, salt);
  const ms = Math.max((now() - start) / runs, 1e-6);
  return { algorithm, ms, runs, perSecond: 1000 / ms };
}

/**
 * Ratio of the slowest to the fastest measured algorithm: how many fast-hash
 * verifications fit in the time of one password hash. A derived figure.
 */
export function slowdownFactor(timings: KdfTiming[]): number | null {
  if (timings.length < 2) return null;
  const times = timings.map((t) => t.ms);
  return Math.max(...times) / Math.min(...times);
}
