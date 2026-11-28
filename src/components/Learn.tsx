import { CaseComparison } from './CaseComparison';
import { useState } from 'react';
import { lessonIds, lessons, type LessonId } from '../lessons/catalog';
import { scene } from '../lessons/scene';
import type { Language } from '../store';
const controls = {
  it: ['Salt unici', 'Salt unico', 'Correlazione tra account', 'Secondo fattore richiesto'],
  en: ['Unique salts', 'Unique salt', 'Cross-account correlation', 'Second factor required']
};

function Exercise({ id, language }: { id: LessonId; language: Language }) {
  const it = language === 'it',
    lesson = lessons[language][id];
  const [prediction, predict] = useState<number | null>(null),
    [revealed, reveal] = useState(false),
    [guard, setGuard] = useState(true),
    [quiz, setQuiz] = useState<number | null>(null);
  const [answers, setAnswers] = useState({ responses: 0, correct: 0 });
  function answer(choice: number) {
    if (quiz === null)
      setAnswers((previous) => ({
        responses: previous.responses + 1,
        correct: previous.correct + Number(choice === lesson.answer)
      }));
    setQuiz(choice);
  }
  const rows = scene(id, guard, language);
  // SVG content is sourced exclusively from the fixed lesson catalog.
  const card =
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="380" viewBox="0 0 900 380"><rect width="900" height="380" fill="#141925"/><g fill="#eef1f7" font-family="sans-serif"><text x="40" y="60" font-size="28">CrackLab</text><text x="40" y="140" font-size="23">' +
    lesson.title +
    '</text>' +
    lesson.defense
      .match(/.{1,56}(?:\s|$)|\S+/g)
      ?.map((line, i) => '<text x="40" y="' + (220 + i * 35) + '" font-size="21">' + line.trim() + '</text>')
      .join('') +
    '</g></svg>';
  return (
    <article className="panel">
      <h2>{lesson.title}</h2>
      <fieldset disabled={revealed}>
        <legend>{it ? 'La tua previsione' : 'Your prediction'}</legend>
        {lesson.prediction.map((choice, i) => (
          <button key={i} aria-pressed={prediction === i} onClick={() => predict(i)}>
            {choice}
          </button>
        ))}
      </fieldset>
      <button
        disabled={prediction === null}
        onClick={() => {
          if (revealed) {
            predict(null);
            setQuiz(null);
            setGuard(true);
          }
          reveal(!revealed);
        }}
      >
        {revealed ? (it ? 'Ricomincia' : 'Restart') : it ? 'Mostra l’esperimento' : 'Show experiment'}
      </button>
      {revealed && (
        <div className="scene-step">
          <p role="status">
            {prediction === lesson.correct
              ? it
                ? 'Previsione corretta.'
                : 'Correct prediction.'
              : it
                ? 'Osserva dove cambia il risultato.'
                : 'Look for where the outcome changes.'}
          </p>
          <h3>{lesson.evidence}</h3>
          <label className="block">
            <input type="checkbox" checked={guard} onChange={(e) => setGuard(e.target.checked)} />{' '}
            {controls[language][lessonIds.indexOf(id)]}
          </label>
          <dl aria-live="polite" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="rounded border border-stroke p-3">
                <dt>{k}</dt>
                <dd className="font-mono text-defense">{v}</dd>
              </div>
            ))}
          </dl>
          <p>{lesson.explanation}</p>
          <p>
            <strong>{it ? 'Limite del modello' : 'Model limit'}</strong> · {lesson.limit}
          </p>
          <p>
            <strong>{it ? 'Difesa' : 'Defense'}</strong> · {lesson.defense}
          </p>
          <CaseComparison language={language} online={id === 'lockout' || id === 'mfa'} />
          <details>
            <summary>{it ? 'Verifica cosa hai capito' : 'Check your understanding'}</summary>
            <fieldset>
              <legend>{lesson.quiz}</legend>
              {lesson.choices.map((choice, i) => (
                <button key={i} aria-pressed={quiz === i} onClick={() => answer(i)}>
                  {choice}
                </button>
              ))}
            </fieldset>
            <p role="status">
              {quiz === null
                ? ''
                : quiz === lesson.answer
                  ? it
                    ? 'Corretto.'
                    : 'Correct.'
                  : (it ? 'Riprova. ' : 'Try again. ') + lesson.explanation}
            </p>
          </details>
          {answers.responses > 0 && (
            <details>
              <summary>{it ? 'Risultati della lezione' : 'Lesson results'}</summary>
              <p>
                {it ? 'Prime risposte corrette in questa pagina' : 'Correct first responses on this page'}:{' '}
                {answers.correct} / {answers.responses}.{' '}
                {it
                  ? 'Ricomincia per una nuova prova. I conteggi si azzerano uscendo dalla pagina.'
                  : 'Restart for a new trial. Counts reset when you leave the page.'}
              </p>
              <a
                href={
                  'data:application/json;charset=utf-8,' +
                  encodeURIComponent(JSON.stringify({ lesson: id, ...answers }))
                }
                download={'cracklab-quiz-' + id + '.json'}
              >
                {it ? 'Esporta i conteggi anonimi' : 'Export anonymous counts'}
              </a>
            </details>
          )}
          <a download={'cracklab-' + id + '.svg'} href={'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(card)}>
            {it ? 'Scarica la scheda didattica' : 'Download lesson card'}
          </a>
        </div>
      )}
    </article>
  );
}
export function Learn({ language }: { language: Language }) {
  const slug = location.pathname.split('/')[2];
  const id = lessonIds.find((x) => x === slug);
  return (
    <>
      <nav aria-label={language === 'it' ? 'Esperimenti' : 'Experiments'} className="panel">
        <ul className="space-y-2">
          {lessonIds.map((k) => (
            <li key={k}>
              <a href={'/capisci/' + k + '/'} aria-current={k === id ? 'page' : undefined}>
                {lessons[language][k].title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {id && <Exercise id={id} language={language} />}
    </>
  );
}
