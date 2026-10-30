# The estimation model

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English

The model is CrackLab's trust-critical, contestable core. It is deliberately transparent, versioned, and
challengeable through a pull request.

### What it computes

For each _example × algorithm × scenario_:

```
estimated_guesses = zxcvbn guesses        (NOT 2^entropy, NOT the whole keyspace)
hash_rate         = benchmark per algorithm/params/hardware   (src/model/data/benchmarks.json)
estimated_time    = estimated_guesses / hash_rate             (seconds)
estimated_cost    = (estimated_time / 3600) × hourly_price     (src/model/data/pricing.json, illustrative)
```

CrackLab shows the **order of magnitude** (`magnitudeKey`: instant → seconds → … → centuries), never a
false-precision figure.

### Three declared scenarios

`prudent`, `central`, `aggressive` are **illustrative** attacker framings (hardware + dictionary strategy),
**not** statistical confidence intervals — stated plainly in the UI.

### Provenance (`kind`)

Every dataset entry declares a `kind`:

- `measured` — a primary benchmark (e.g. public `hashcat -b` output with tool version); the only class shown as evidence.
- `derived` — computed from a measured value with a stated formula.
- `assumption` — a declared illustrative figure; never presented with the authority of a measurement.

The dataset currently ships order-of-magnitude **assumptions** so the model is end-to-end from day one; they are
meant to be replaced by measured benchmarks via PR. See `src/model/data/README.md`.

### Tests (blocking in CI)

- Expected monotonicity: for the same guesses, MD5 < SHA-256 ≪ bcrypt/Argon2id in estimated time.
- Property-based (`fast-check`): more guesses never means less time; the magnitude bucket never decreases.
- Every entry carries `source`, `date` and `kind`; `npm run verify:model` fails on a missing field and **warns**
  past 12 months.

### Honesty rules

Costs are illustrative (cloud prices vary by time, region and availability). The in-browser KDF benchmark answers
"how expensive is one verification _here_?" and is never auto-converted into an attacker-performance prediction.

## Italiano

Il modello è il cuore contestabile e trasparente di CrackLab, versionato e modificabile via pull request.

### Cosa calcola

Per ogni _esempio × algoritmo × scenario_:

```
tentativi_stimati = guesses di zxcvbn      (NON 2^entropia, NON l'intero spazio delle chiavi)
hashrate          = benchmark per algoritmo/parametri/hardware   (src/model/data/benchmarks.json)
tempo_stimato     = tentativi_stimati / hashrate                 (secondi)
costo_stimato     = (tempo_stimato / 3600) × prezzo_orario        (src/model/data/pricing.json, illustrativo)
```

CrackLab mostra l'**ordine di grandezza**, mai una cifra a falsa precisione.

### Tre scenari dichiarati

`prudent`, `central`, `aggressive` sono inquadramenti **illustrativi** dell'attaccante (hardware + strategia di
dizionari), **non** intervalli di confidenza — dichiarato in chiaro nella UI.

### Provenienza (`kind`)

Ogni voce dichiara un `kind`: `measured` (benchmark primario, unica classe mostrata come evidenza), `derived`
(calcolato da un valore misurato con formula dichiarata), `assumption` (ipotesi illustrativa, mai con l'autorità di
una misura). I dati attuali sono **ipotesi** per ordine di grandezza, da sostituire con benchmark misurati via PR.

### Test (bloccanti in CI)

Monotonie attese, property-based (`fast-check`), presenza di `source`/`date`/`kind` e avviso oltre 12 mesi
(`npm run verify:model`).

### Regole di onestà

I costi sono illustrativi; il benchmark KDF nel browser risponde a "quanto costa una verifica _qui_?" e non diventa
mai automaticamente una previsione sulle prestazioni dell'attaccante.
