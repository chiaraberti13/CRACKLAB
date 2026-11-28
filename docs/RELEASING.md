# Releasing

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

Releases follow Semantic Versioning and are cut from `main`.

1. Update `package.json#version` and add the matching `## [x.y.z] - DATE` section to `CHANGELOG.md`.
2. Validate the candidate on `main` with `npm run verify`, the Playwright suite and the release criteria in [ROADMAP.md](ROADMAP.md).
3. Tag the validated commit `vX.Y.Z` and push the tag.

The `Verifiable Release` workflow then:

- confirms the tag is an ancestor of `main` and that `vX.Y.Z` matches `package.json#version`;
- validates the changelog and extracts the release notes (`scripts/release-metadata.mjs`);
- runs the lockfile policy, `npm run verify`, and the Playwright/axe suite;
- builds a deterministic `cracklab-vX.Y.Z.tar.gz` of `dist/` with a `SHA256SUMS`;
- publishes a GitHub release with the archive, checksums and extracted notes.

Verify a download with `sha256sum -c SHA256SUMS`.

## Italiano

Le release seguono il versionamento semantico e partono da `main`.

1. Aggiorna `package.json#version` e aggiungi la sezione `## [x.y.z] - DATA` in `CHANGELOG.md`.
2. Valida il candidato su `main` con `npm run verify`, la suite Playwright e i criteri di rilascio di [ROADMAP.md](ROADMAP.md).
3. Tagga il commit validato `vX.Y.Z` e fai push del tag.

Il workflow `Verifiable Release` verifica tag/versione, valida il changelog ed estrae le note, esegue lockfile policy,
`npm run verify` e la suite Playwright/axe, costruisce un archivio deterministico con `SHA256SUMS` e pubblica la release.
Verifica un download con `sha256sum -c SHA256SUMS`.
