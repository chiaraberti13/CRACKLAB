import { describe, expect, it } from 'vitest';
import { evaluateStrength } from './strength';

describe('evaluateStrength', () => {
  it('rates a common password as highly predictable', async () => {
    const weak = await evaluateStrength('password123');
    expect(weak.score).toBeLessThanOrEqual(1);
    expect(weak.guesses).toBeGreaterThan(0);
  });

  it('gives a long random passphrase far more estimated guesses than a common word', async () => {
    const weak = await evaluateStrength('password123');
    const strong = await evaluateStrength('tavolo-brezza-quaranta-ruggine-9x');
    expect(strong.guesses).toBeGreaterThan(weak.guesses);
    expect(strong.score).toBeGreaterThanOrEqual(weak.score);
  });
});
