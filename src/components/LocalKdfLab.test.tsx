// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocalKdfLab } from './LocalKdfLab';

vi.mock('../workers/kdfClient', () => ({
  runInWorker: vi.fn(async (algorithm: string) => {
    const ms = algorithm === 'md5' ? 0.001 : algorithm === 'sha256' ? 0.002 : 100;
    return { algorithm, ms, runs: 1, perSecond: 1000 / ms };
  })
}));

afterEach(cleanup);

describe('LocalKdfLab', () => {
  it('runs all four algorithms and labels the outcome measured/derived', async () => {
    render(<LocalKdfLab language="en" />);
    await userEvent.click(screen.getByRole('button', { name: /run the real comparison/i }));
    await waitFor(() => expect(screen.getByText(/slowest KDF costs/i)).toBeTruthy());
    for (const name of ['MD5', 'SHA-256', 'bcrypt', 'Argon2id'])
      expect(screen.getByText(new RegExp(`^${name}: `))).toBeTruthy();
    expect(screen.getAllByText('measured').length).toBe(4);
    expect(screen.getByText('derived')).toBeTruthy();
  });

  it('reports a failure without crashing', async () => {
    const mod = await import('../workers/kdfClient');
    vi.mocked(mod.runInWorker).mockRejectedValueOnce(new Error('timeout'));
    render(<LocalKdfLab language="it" />);
    await userEvent.click(screen.getByRole('button', { name: /esegui il confronto/i }));
    await waitFor(() => expect(screen.getByText(/misurazione interrotta/i)).toBeTruthy());
  });
});
