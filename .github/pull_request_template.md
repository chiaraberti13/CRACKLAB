## Summary

<!-- What changes and why, in a few lines. -->

**Roadmap item:** <!-- e.g. Fase 1 — clessidra; "none" only for trivial fixes -->
**Issue:** <!-- Closes #… -->

## Changes

-

## Verification

<!-- Commands run and their result. For a CI fix, show the failure reproduced first. -->

## Definition of Done

<!-- Tick only what is true; explain every unchecked item below. -->

- [ ] No network access added; the sample never leaves the browser (privacy e2e green)
- [ ] The input is never persisted, put in a URL, or added to a share card
- [ ] Estimates stay honest: order of magnitude, declared assumptions, `measured/derived/assumption` labels
- [ ] Benchmark/pricing changes keep `source`, `date`, `kind` and pass `npm run verify:model`
- [ ] Unit tests added or updated; `model/` and `sim/` coverage stays at or above threshold
- [ ] Italian and English content remain semantically equivalent
- [ ] Keyboard access, visible focus, contrast and `prefers-reduced-motion` preserved (axe green)
- [ ] `npm run verify` and the Playwright suite pass
- [ ] Docs, `CHANGELOG.md` and `ROADMAP.md` reflect the actual result

### Unchecked items

<!-- Why each unchecked item does not apply or what follows up. -->
