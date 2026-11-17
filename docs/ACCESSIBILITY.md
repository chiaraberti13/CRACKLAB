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

## Scope and verification status

Scenarios, controls, estimates and animations. Check that information remains available without colour or motion.

Accessibility is an ongoing objective. Automated checks do not replace manual assessment with assistive technology. This statement does not certify WCAG conformance. Lack of reported issues does not establish the absence of barriers.

## Environments and limitations

See the [README](../README.md) for runtime requirements. Runtime support does not imply compatibility with every assistive technology. Record browser, operating system, screen reader or terminal versions when testing. Third-party components and exported documents require separate assessment.

## Report a barrier

Open an [accessibility issue](https://github.com/chiaraberti13/CRACKLAB/issues/new?template=accessibility.yml) with the task, steps, expected result and environment, including assistive technology if used. No diagnosis or health information is required. Use examples without personal data. Follow the [security policy](../SECURITY.md) for sensitive reports.

## Contribution expectations

- Check keyboard access, focus order and visible focus where applicable.
- Provide clear labels, understandable errors and text alternatives for meaningful images and charts.
- Do not communicate essential information through colour, sound or motion alone.
- Check zoom and readability and respect reduced-motion preferences where applicable.
- Record steps, versions, outcomes and limitations, distinguishing automated and manual checks.

The maintainer coordinates reports and updates this statement as evidence changes. Barriers preventing essential tasks receive priority.
