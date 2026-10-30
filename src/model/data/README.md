# Model data — benchmarks and pricing

This folder holds the **versioned, contestable** inputs to CrackLab's estimation
model. The model is deliberately transparent: every number shown in the UI is
traceable to an entry here, and every entry carries its provenance.

## Files

- `benchmarks.json` — guess rate (hashes/second) per algorithm, parameters and
  hardware, for each of the three declared scenarios.
- `pricing.json` — illustrative hourly price of the compute assumed in each scenario.

## Required fields

Each entry **must** declare:

| Field    | Meaning                                                                 |
| -------- | ----------------------------------------------------------------------- |
| `kind`   | `measured`, `derived` or `assumption` (see below)                       |
| `source` | Where the figure comes from (a primary benchmark, a formula, or a note) |
| `date`   | ISO `YYYY-MM-DD` the figure was recorded                                |
| `url`    | Authoritative link, when one exists                                     |

`node scripts/model-data.mjs` checks these in CI and **warns when a benchmark is
older than 12 months**.

## Provenance classes (`kind`)

- **`measured`** — a primary benchmark, e.g. public output of `hashcat -b`, with
  the tool version and driver. This is the only class presented as evidence.
- **`derived`** — a value computed from a measured one with a stated formula
  (for example, scaling from one parameter set to another). The formula goes in `notes`.
- **`assumption`** — a declared illustrative figure. The UI labels it clearly and
  never presents it with the authority of a measurement.

> The dataset currently ships **order-of-magnitude assumptions** so the model is
> end-to-end and testable from day one. They are meant to be replaced by
> `measured` benchmarks through pull requests — that is the point of versioning them.

## Proposing an update (via PR)

1. Add or edit an entry with **all** required fields.
2. Prefer `measured` with a reproducible command and the exact tool version.
3. Keep the monotonicity the model tests assume (a slow KDF must stay slower per
   guess than a fast hash); `npm run verify:model` enforces this.
4. Multi-GPU scaling uses **measured values per configuration**, never automatic
   multiplication of a single-GPU figure.

Pricing is **illustrative**: cloud prices vary by time, region and availability
(spot vs on-demand), and energy/setup may be in or out of scope. Always keep the
`date` current and say what the price includes.
