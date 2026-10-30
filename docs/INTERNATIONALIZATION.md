# Internationalization (IT/EN)

CrackLab is bilingual with **no runtime i18n dependency**.

- The typed catalog lives in `src/i18n/index.ts`. Both `it` and `en` are declared as the same `Catalog` type, so
  TypeScript rejects a key present in one language and missing in the other — the two stay in parity by construction.
- The active language is a persisted preference (`src/store.ts`); switching is instant and the sample input is
  untouched.
- Technical terms are preserved across languages; educational claims cite the same authoritative source in both.

## Adding or changing strings

1. Add the key to the `Catalog` interface.
2. Fill it in **both** `it` and `en`; TypeScript fails the build if either is missing.
3. Keep the two semantically equivalent (not a word-for-word translation where idiom differs).
4. Update any affected tests and documentation in both languages.

User-facing numbers are formatted with `Intl.NumberFormat` using the active locale (`it-IT` / `en-US`).
