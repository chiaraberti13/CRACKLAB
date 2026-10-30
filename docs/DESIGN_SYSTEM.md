# Design system

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

The "laboratory" visual system. Tokens live in `src/index.css` under Tailwind v4 `@theme`, so components never
hard-code hex values; Tailwind generates the matching utilities (`bg-surface`, `text-ink-muted`, `text-attack`, …).

### Semantic meaning of colour

- **Attack = red** (`--color-attack`), **defense = bronze/gold** (`--color-defense`), **assumption = neutral gray**
  (`--color-assumption`). Colour never carries meaning alone: every state also has text and/or an icon.
- Dark base canvas and surfaces; a single accent (`--color-accent`) for focus and interactive emphasis.

### Honesty in data display

Numbers are shown as **orders of magnitude** ("seconds / days / centuries"), never 12-decimal figures, and every
figure carries a provenance badge: `measured` / `derived` / `assumption`.

### Accessibility

All text/background pairings meet WCAG AA (4.5:1); the attack red is tuned to clear AA on the dark surface. Focus is
always visible; `prefers-reduced-motion` is honoured. See `docs/ACCESSIBILITY.md`.

## Italiano

Sistema visivo "laboratorio". I token sono in `src/index.css` sotto `@theme` di Tailwind v4: i componenti non
scrivono mai valori esadecimali e Tailwind genera le utility corrispondenti.

### Significato semantico del colore

**Attacco = rosso**, **difesa = bronzo/oro**, **ipotesi = grigio neutro**. Il colore non porta mai il significato
da solo: ogni stato ha anche testo e/o icona. Base scura, un solo accento per focus ed enfasi.

### Onestà nella visualizzazione

Numeri per **ordine di grandezza**, mai cifre a falsa precisione, con etichetta di provenienza
`misurato` / `derivato` / `ipotesi`.

### Accessibilità

Coppie testo/sfondo conformi a WCAG AA (4,5:1); il rosso d'attacco è tarato per superare AA sulla superficie scura.
Focus sempre visibile; `prefers-reduced-motion` rispettato. Vedi `docs/ACCESSIBILITY.md`.
