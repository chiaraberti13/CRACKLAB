/** Small, fixed classroom populations. Only aggregate counts enter these calculations. */
export const spaces = { dictionary: 8, mask: 4 * 4, exhaustive: 4 ** 3 } as const;
export type Strategy = keyof typeof spaces;
export function offlineWork(strategy: Strategy, uniqueSalts: boolean, expensive: boolean) {
  const possibilities = spaces[strategy];
  const records = 2;
  const checks = possibilities * (uniqueSalts ? records : 1);
  const unitsPerCheck = expensive ? 10 : 1;
  return { possibilities, checks, units: checks * unitsPerCheck };
}

const logSummaries = {
  dictionary: { failures: [6], validPairs: 0 },
  stuffing: { failures: [1, 1, 1, 1], validPairs: 1 },
  spraying: { failures: [1, 1, 1, 1, 1, 1], validPairs: 0 }
};
export type LogCase = keyof typeof logSummaries;
export type Defense = 'observe' | 'lockout' | 'rate' | 'delay' | 'correlate' | 'mfa';

/** Retrospective view of one synthetic time window. The valid pair, if present,
 * is the first event on a separate account. Each policy is shown in isolation. */
export function reviewLog(kind: LogCase, defense: Defense) {
  const { failures, validPairs } = logSummaries[kind];
  const total = failures.reduce((a, b) => a + b, validPairs);
  let blocked = 0;
  if (defense === 'lockout') blocked = failures.reduce((n, count) => n + Math.max(0, count - 5), 0);
  if (defense === 'rate') blocked = Math.max(0, total - 3);
  const waitUnits = defense === 'delay' ? failures.reduce((n, count) => n + (count * (count - 1)) / 2, 0) : 0;
  const challenge = defense === 'mfa' ? validPairs : 0;
  return {
    total,
    known: validPairs,
    firstFactor: validPairs,
    access: validPairs - challenge,
    blocked: blocked + challenge,
    detected: defense === 'correlate' && failures.length >= 4,
    waitUnits
  };
}
