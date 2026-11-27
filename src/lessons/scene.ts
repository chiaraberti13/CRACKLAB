import type { LessonId } from './catalog';
import type { Language } from '../store';

// Fixed aggregate teaching cases. Neither credentials nor account endpoints enter this model.
export function scene(id: LessonId, guard: boolean, language: Language): [string, string][] {
  const it = language === 'it';
  if (id === 'same-password')
    return [
      [it ? 'Record A' : 'Record A', guard ? 'salt A → α' : '∅ → α'],
      ['Record B', guard ? 'salt B → β' : '∅ → α']
    ];
  if (id === 'salt')
    return [
      [it ? 'Record osservati' : 'Observed records', '1'],
      [it ? 'Verifiche per una ipotesi' : 'Checks for one guess', '1'],
      ['Salt', guard ? (it ? 'unico' : 'unique') : '∅']
    ];
  if (id === 'lockout') {
    const failures = [1, 1, 1, 1, 1, 1];
    return [
      [it ? 'Account con errori' : 'Accounts with failures', String(failures.length)],
      [
        it ? 'Blocchi individuali (soglia 5)' : 'Individual lockouts (threshold 5)',
        String(failures.filter((n) => n >= 5).length)
      ],
      [
        it ? 'Avviso trasversale' : 'Cross-account alert',
        guard ? (it ? 'rilevato' : 'detected') : it ? 'disattivato' : 'disabled'
      ]
    ];
  }
  const yes = it ? 'sì' : 'yes',
    no = 'no';
  return [
    [it ? 'Password conosciuta' : 'Password known', yes],
    [it ? 'Primo fattore superato' : 'First factor passed', yes],
    [it ? 'Accesso completato' : 'Session granted', guard ? no : yes],
    [it ? 'Accesso bloccato' : 'Session blocked', guard ? yes : no]
  ];
}
