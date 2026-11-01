import { argon2id, bcrypt, md5, sha256 } from 'hash-wasm';
import type { Algorithm } from '../model/types';
import { SYNTHETIC_INPUT, clampParams } from './kdfBench';
import type { Hasher, KdfParams } from './kdfBench';

/** Real hash/KDF execution (hash-wasm) on the fixed synthetic input only. */
export const hasher: Hasher = async (algorithm: Algorithm, raw: KdfParams, salt: Uint8Array) => {
  const p = clampParams(raw);
  switch (algorithm) {
    case 'md5':
      return md5(SYNTHETIC_INPUT);
    case 'sha256':
      return sha256(SYNTHETIC_INPUT);
    case 'bcrypt':
      return bcrypt({ password: SYNTHETIC_INPUT, salt, costFactor: p.bcryptCost, outputType: 'encoded' });
    case 'argon2id':
      return argon2id({
        password: SYNTHETIC_INPUT,
        salt,
        parallelism: p.argonParallelism,
        iterations: p.argonIterations,
        memorySize: p.argonMemoryKiB,
        hashLength: 32,
        outputType: 'encoded'
      });
  }
};
