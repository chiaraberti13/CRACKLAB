/// <reference lib="webworker" />
import type { Algorithm } from '../model/types';
import { timeAlgorithm } from '../sim/kdfBench';
import type { KdfParams } from '../sim/kdfBench';
import { hasher } from '../sim/kdfHasher';

export interface WorkerRequest {
  id: number;
  algorithm: Algorithm;
  params: KdfParams;
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, algorithm, params } = event.data;
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const timing = await timeAlgorithm(algorithm, params, hasher, undefined, salt);
    self.postMessage({ id, ok: true, timing });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : 'error' });
  }
};
