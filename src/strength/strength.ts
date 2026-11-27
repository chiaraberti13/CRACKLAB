import { MAX_SAMPLE_LENGTH } from './limits';
import { ZxcvbnFactory } from '@zxcvbn-ts/core';

/**
 * Predictability estimate for a sample password, computed entirely in the browser.
 *
 * We report zxcvbn's **estimated number of guesses** and its 0–4 score. This is a
 * measure of *predictability*, not the "real entropy" of a human-chosen password,
 * which a single sample cannot measure — stated plainly in the UI copy.
 *
 * The Italian and English dictionaries are heavy, so they are imported on demand
 * and land in their own lazy chunks, keeping the initial bundle small.
 */
export interface StrengthResult {
  /** zxcvbn estimate of how many guesses are needed. Never 2^entropy. */
  guesses: number;
  /** zxcvbn 0 (very weak) – 4 (very strong). */
  score: number;
}

let factory: ZxcvbnFactory | null = null;
let configuring: Promise<ZxcvbnFactory> | null = null;

async function getFactory(): Promise<ZxcvbnFactory> {
  if (factory) return factory;
  if (!configuring) {
    configuring = (async () => {
      const [common, en, it] = await Promise.all([
        import('@zxcvbn-ts/language-common'),
        import('@zxcvbn-ts/language-en'),
        import('@zxcvbn-ts/language-it')
      ]);
      factory = new ZxcvbnFactory({
        dictionary: {
          ...common.dictionary,
          ...en.dictionary,
          ...it.dictionary
        },
        graphs: common.adjacencyGraphs,
        translations: en.translations
      });
      return factory;
    })().catch((error: unknown) => {
      configuring = null;
      throw error;
    });
  }
  return configuring;
}

/** Estimate the predictability of a sample password. Local-only, no network. */
export async function evaluateStrength(password: string): Promise<StrengthResult> {
  if (password.length > MAX_SAMPLE_LENGTH) throw new RangeError('Sample too long');
  const instance = await getFactory();
  const result = instance.check(password);
  if (!Number.isFinite(result.guesses) || result.guesses <= 0) throw new RangeError('Estimate outside numeric range');
  return { guesses: result.guesses, score: result.score };
}
