import { useEffect, useRef, useState } from 'react';
import type { Language } from '../store';
import { MAX_SAMPLE_LENGTH } from '../strength/limits';

export function BreachCheck({ language }: { language: Language }) {
  const it = language === 'it';
  const [sample, setSample] = useState(''),
    [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'found' | 'absent' | 'error'>('idle');
  const job = useRef(0),
    worker = useRef<Worker | null>(null);
  useEffect(
    () => () => {
      job.current++;
      worker.current?.terminate();
    },
    []
  );
  function cancel() {
    job.current++;
    worker.current?.terminate();
    worker.current = null;
    setStatus('idle');
  }
  async function check() {
    const id = ++job.current;
    setStatus('checking');
    try {
      const bytes = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(sample));
      if (id !== job.current) return;
      const hex = Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
      const w = new Worker('/hibp/range-worker.js');
      worker.current = w;
      function finish(next: 'found' | 'absent' | 'error') {
        w.terminate();
        if (job.current === id) {
          worker.current = null;
          setStatus(next);
        }
      }
      w.onerror = () => finish('error');
      w.onmessage = (e: MessageEvent<unknown>) => {
        if (typeof e.data !== 'string') return finish('error');
        const lines = e.data.trim().split(/\r?\n/);
        if (!lines.every((line) => /^[A-F0-9]{35}:\d+$/i.test(line))) return finish('error');
        finish(
          lines.some((line) => line.slice(0, 35).toUpperCase() === hex.slice(5) && Number(line.slice(36)) > 0)
            ? 'found'
            : 'absent'
        );
      };
      w.postMessage(hex.slice(0, 5));
    } catch {
      if (job.current === id) setStatus('error');
    }
  }
  const messages = it
    ? {
        idle: '',
        checking: 'Verifica in corso…',
        found: 'Esempio presente nel corpus.',
        absent: 'Esempio assente nel corpus consultato. La sua sicurezza resta da valutare.',
        error: 'Servizio non disponibile. Puoi riprovare.'
      }
    : {
        idle: '',
        checking: 'Checking…',
        found: 'Example found in the corpus.',
        absent: 'No match in the corpus checked. Strength still needs to be evaluated.',
        error: 'Service unavailable. You can retry.'
      };
  return (
    <section className="panel">
      <h2>Pwned Passwords</h2>
      <p>
        {it
          ? 'Usa un esempio inventato. Solo premendo Verifica invii i primi cinque caratteri esadecimali del digest SHA-1. Il servizio vede il prefisso, il tuo IP e i metadati di rete. Il confronto dei suffissi avviene qui, con risposta riempita di voci fittizie.'
          : 'Use an invented sample. Pressing Check sends the first five hexadecimal digits of its SHA-1 digest. The service sees the prefix, IP and network metadata. Suffixes from the padded response are compared here.'}
      </p>
      <label className="block">
        {it ? 'Esempio inventato' : 'Invented sample'}{' '}
        <input
          type="password"
          name="cracklab-breach-sample"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          data-1p-ignore=""
          data-lpignore="true"
          data-bwignore=""
          maxLength={MAX_SAMPLE_LENGTH}
          value={sample}
          onChange={(e) => {
            cancel();
            setSample(e.target.value);
          }}
        />
      </label>
      <label className="block">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            cancel();
            setConsent(e.target.checked);
          }}
        />{' '}
        {it ? 'Acconsento alla richiesta esterna' : 'Allow the external request'}
      </label>
      <button disabled={!sample || !consent || status === 'checking'} onClick={() => void check()}>
        {it ? 'Verifica' : 'Check'}
      </button>
      <button
        onClick={() => {
          cancel();
          setSample('');
          setConsent(false);
        }}
      >
        {it ? 'Svuota tutto' : 'Clear all'}
      </button>
      <p role="status">{messages[status]}</p>
    </section>
  );
}
