// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStore } from './store';

describe('store', () => {
  beforeEach(() => {
    useStore.setState({ sample: '', language: 'it', theme: 'dark', scenario: 'central' });
  });

  it('updates the in-memory sample and clears it', () => {
    useStore.getState().setSample('password123');
    expect(useStore.getState().sample).toBe('password123');
    useStore.getState().clearAll();
    expect(useStore.getState().sample).toBe('');
  });

  it('never persists the sample to storage', () => {
    useStore.getState().setSample('secret-example');
    const persisted = localStorage.getItem('cracklab:prefs') ?? '';
    expect(persisted).not.toContain('secret-example');
    expect(persisted).not.toContain('sample');
  });

  it('persists only the allowlisted preferences', () => {
    useStore.getState().setLanguage('en');
    useStore.getState().setScenario('aggressive');
    const persisted = JSON.parse(localStorage.getItem('cracklab:prefs') ?? '{}');
    expect(persisted.state).toEqual({ language: 'en', theme: 'dark', scenario: 'aggressive' });
  });

  it('rehydrates only valid preferences and preserves transient state and actions', async () => {
    localStorage.setItem(
      'cracklab:prefs',
      JSON.stringify({
        state: { language: 'en', theme: 'light', scenario: 'unknown', sample: 'legacy sample', clearAll: null },
        version: 1
      })
    );

    await useStore.persist.rehydrate();

    expect(useStore.getState()).toMatchObject({ language: 'en', theme: 'light', scenario: 'central', sample: '' });
    expect(useStore.getState().clearAll).toBeTypeOf('function');
  });

  it('keeps the current session usable when storage throws', async () => {
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'QuotaExceededError');
    });
    const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage unavailable', 'SecurityError');
    });
    try {
      await useStore.persist.rehydrate();
      useStore.getState().setLanguage('en');
      useStore.getState().setSample('invented example');
      expect(useStore.getState()).toMatchObject({ language: 'en', sample: 'invented example' });
    } finally {
      write.mockRestore();
      read.mockRestore();
    }
  });
});
