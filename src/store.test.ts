// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
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
});
