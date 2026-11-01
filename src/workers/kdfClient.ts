import { KDF_TIMEOUT_MS } from '../sim/kdfBench';
import type { KdfParams, KdfTiming } from '../sim/kdfBench';
import type { Algorithm } from '../model/types';

/** Run one algorithm in a fresh Web Worker; terminate it on timeout (guardrail). */
export function runInWorker(algorithm: Algorithm, params: KdfParams): Promise<KdfTiming> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./kdf.worker.ts', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => {
      worker.terminate();
      reject(new Error('timeout'));
    }, KDF_TIMEOUT_MS);
    worker.onmessage = (event: MessageEvent<{ ok: boolean; timing?: KdfTiming; error?: string }>) => {
      clearTimeout(timer);
      worker.terminate();
      if (event.data.ok && event.data.timing) resolve(event.data.timing);
      else reject(new Error(event.data.error ?? 'error'));
    };
    worker.onerror = () => {
      clearTimeout(timer);
      worker.terminate();
      reject(new Error('worker'));
    };
    worker.postMessage({ id: 1, algorithm, params });
  });
}
