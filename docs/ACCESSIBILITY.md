# Accessibility

CrackLab targets **WCAG 2.1 AA** from the MVP.

- **Colour is never the only signal.** Attack/defense/assumption states carry text and/or icons as well as colour.
- **Contrast.** All text/background pairings meet AA (4.5:1); verified by the axe end-to-end test.
- **Keyboard.** Full keyboard operation, a skip link to the main content, visible focus (`:focus-visible`), and
  `aria-pressed` on toggle controls (scenario selector).
- **Motion.** `prefers-reduced-motion` is honoured globally; animations collapse to an equivalent static view with
  no loss of information (the "clessidra" animation ships with a static equivalent in Fase 1).
- **Live regions.** Simulation results are announced with `aria-live="polite"`.
- **Responsive.** No horizontal page scroll; a 16px side gutter; verified at 390 px and 768 px.

## Enforcement

`@axe-core/playwright` runs in CI against the production build (`e2e/accessibility.spec.ts`) with WCAG 2.0/2.1 A and
AA tags, and Lighthouse CI enforces a minimum accessibility score. A new interactive view must pass axe before merge.
