import type { Language } from '../store';

const words = {
  it: 'alba arco ape barca bosco busta campo carta cedro cielo corda dado duna elmo faro felce filo fiore foglia forno fuoco gatto gesso lago lana luna mare melo nave neve onda olmo orso pera remo seta',
  en: 'acorn arch ash bark bay beam birch boat brook cake cedar clay cloud coal coral dawn deer dune elm fern field fire flax foam fork frog gate glow hill lake leaf mint moon oak pear reed'
};
export const WORD_COUNT = 12;
export const SPACE = 36n ** BigInt(WORD_COUNT);
export function generateExample(language: Language) {
  const list = words[language].split(' '),
    chosen: string[] = [];
  const bytes = new Uint8Array(24);
  while (chosen.length < WORD_COUNT) {
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      // 252 is the largest multiple of 36 below 256. Discard the biased tail.
      if (b < 252) chosen.push(list[b % 36]);
      if (chosen.length === WORD_COUNT) break;
    }
  }
  return chosen.join('-');
}
