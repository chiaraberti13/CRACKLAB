import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Scenario } from './model/types';

/**
 * Global state. This module is the **only approved persistence boundary** (see
 * eslint.config.js): it may touch localStorage, but only through the versioned,
 * allowlisted preference schema below. The sample password (`sample`) is held in
 * memory and is **never** persisted, put in a URL, or written to any storage.
 */

export type Language = 'it' | 'en';
export type Theme = 'dark' | 'light';

/** Persisted, non-sensitive UI preferences only. */
interface Preferences {
  language: Language;
  theme: Theme;
  scenario: Scenario;
}

interface CrackLabState extends Preferences {
  /** The sample under study. In-memory only; cleared by `clearAll`. Never persisted. */
  sample: string;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setScenario: (scenario: Scenario) => void;
  setSample: (sample: string) => void;
  /** Wipe the input, results-bound sample and reset transient state. */
  clearAll: () => void;
}

const PREFERENCES_VERSION = 1;

/**
 * An in-memory fallback so the store works in Node/jsdom tests and in browsers
 * where Web Storage is blocked. We never claim secure erasure: in JavaScript,
 * strings are immutable and their removal depends on the garbage collector.
 */
function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
    setItem: (key, value) => void map.set(key, String(value)),
    removeItem: (key) => void map.delete(key),
    clear: () => map.clear(),
    key: (index) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size;
    }
  } as Storage;
}

export const useStore = create<CrackLabState>()(
  persist(
    (set) => ({
      language: 'it',
      theme: 'dark',
      scenario: 'central',
      sample: '',
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setScenario: (scenario) => set({ scenario }),
      setSample: (sample) => set({ sample }),
      clearAll: () => set({ sample: '' })
    }),
    {
      name: 'cracklab:prefs',
      version: PREFERENCES_VERSION,
      storage: createJSONStorage(() => (typeof localStorage !== 'undefined' ? localStorage : createMemoryStorage())),
      // The allowlist: only non-sensitive preferences persist. `sample` is omitted
      // on purpose, so the password input can never be written to storage.
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        scenario: state.scenario
      })
    }
  )
);
