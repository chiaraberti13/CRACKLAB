import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SCENARIOS, type Scenario } from './model/types';

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

// Preferences remain usable in the store when browser storage is unavailable.
const preferenceStorage = createJSONStorage<Preferences>(() => ({
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // The preference has already been applied to in-memory state.
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Storage access can be disabled by the browser.
    }
  }
}));

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
      storage: preferenceStorage,
      merge: (persisted, current) => {
        if (typeof persisted !== 'object' || persisted === null) return current;
        const { language, theme, scenario } = persisted as Partial<Record<keyof Preferences, unknown>>;
        return {
          ...current,
          language: language === 'it' || language === 'en' ? language : current.language,
          theme: theme === 'dark' || theme === 'light' ? theme : current.theme,
          scenario: SCENARIOS.find((candidate) => candidate === scenario) ?? current.scenario
        };
      },
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
