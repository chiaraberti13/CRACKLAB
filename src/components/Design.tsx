import type { Language } from '../store';
import { LocalKdfLab } from './LocalKdfLab';
import { Tools } from './Tools';

export function Design({ language }: { language: Language }) {
  return (
    <>
      <LocalKdfLab language={language} />
      <Tools language={language} />
    </>
  );
}
