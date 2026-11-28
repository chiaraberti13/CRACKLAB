import { useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LocalKdfLab } from './components/LocalKdfLab';
import { SampleResult } from './components/SampleResult';
import { BreachCheck } from './components/BreachCheck';
import { Learn } from './components/Learn';
import { Tools } from './components/Tools';
import { useCatalog } from './i18n';
import { SCENARIOS } from './model/types';
import type { Scenario } from './model/types';
import { MAX_SAMPLE_LENGTH } from './strength/limits';
import { useStore } from './store';

export default function App() {
  const language = useStore((s) => s.language);
  const scenario = useStore((s) => s.scenario);
  const sample = useStore((s) => s.sample);
  const setLanguage = useStore((s) => s.setLanguage);
  const setScenario = useStore((s) => s.setScenario);
  const setSample = useStore((s) => s.setSample);
  const clearAll = useStore((s) => s.clearAll);

  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
  }, [language, theme]);
  const section = location.pathname.split('/')[1];
  const t = useCatalog(language);
  const inputId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Theme + language controls, reused inline on desktop and inside the mobile menu.
  const controls = (
    <>
      <button
        type="button"
        className="inline-flex min-h-11 items-center rounded-lg border border-stroke px-3 py-1.5 text-sm text-ink-secondary hover:border-stroke-strong"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? t.navigation.lightTheme : t.navigation.darkTheme}
      </button>
      <button
        type="button"
        onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
        className="inline-flex min-h-11 items-center rounded-lg border border-stroke px-3 py-1.5 text-sm text-ink-secondary hover:border-stroke-strong"
      >
        {t.langToggle}
      </button>
    </>
  );

  const paths: [string, string][] = [
    ['', t.navigation.try],
    ['capisci', t.navigation.learn],
    ['progetta', t.navigation.design]
  ];

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-surface focus:px-3 focus:py-2 focus:text-ink-primary"
      >
        {t.navigation.skipToContent}
      </a>

      <header
        className="border-b border-stroke"
        onKeyDown={(event) => {
          if (menuOpen && event.key === 'Escape' && menuButton.current?.getClientRects().length) {
            setMenuOpen(false);
            menuButton.current.focus();
          }
        }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <span className="font-mono text-lg font-semibold text-ink-primary">{t.appName}</span>
          {/* Desktop: controls inline. Mobile: a hamburger toggles the menu below. */}
          <div className="hidden flex-wrap gap-2 sm:flex">{controls}</div>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-stroke text-ink-secondary hover:border-stroke-strong sm:hidden"
            ref={menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.navigation.closeMenu : t.navigation.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
        <div id="mobile-menu" hidden={!menuOpen} className="border-t border-stroke px-4 py-3 sm:hidden">
          <nav aria-label={t.navigation.label} className="flex flex-col">
            {paths.map(([path, label]) => (
              <a
                className="path-link"
                key={path}
                aria-current={section === path ? 'page' : undefined}
                href={'/' + path + (path ? '/' : '')}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-wrap gap-2 border-t border-stroke pt-3">{controls}</div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <h1 className="text-balance text-2xl font-bold text-ink-primary sm:text-3xl">{t.appName}</h1>
        <p className="mt-2 max-w-2xl text-pretty text-ink-secondary">{t.tagline}</p>

        <nav className="my-5 hidden flex-wrap gap-4 sm:flex" aria-label={t.navigation.label}>
          {paths.map(([path, label]) => (
            <a
              className="path-link"
              key={path}
              aria-current={section === path ? 'page' : undefined}
              href={'/' + path + (path ? '/' : '')}
            >
              {label}
            </a>
          ))}
        </nav>
        {section === 'hibp' ? (
          <BreachCheck language={language} />
        ) : section === 'capisci' ? (
          <Learn language={language} />
        ) : section === 'progetta' ? (
          <>
            <LocalKdfLab language={language} />
            <Tools language={language} />
          </>
        ) : (
          <>
            <div
              role="note"
              className="mt-6 rounded-lg border border-defense/40 bg-defense-soft px-4 py-3 text-sm text-defense"
            >
              {t.warning}
            </div>

            <div className="mt-6">
              <label htmlFor={inputId} className="block text-sm font-medium text-ink-secondary">
                {t.sampleLabel}
              </label>
              <input
                id={inputId}
                type="password"
                name="cracklab-sample"
                maxLength={MAX_SAMPLE_LENGTH}
                value={sample}
                onChange={(event) => setSample(event.target.value)}
                placeholder={t.samplePlaceholder}
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore=""
                data-bwignore=""
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                className="mt-1 min-h-11 w-full rounded-lg border border-stroke-strong bg-code-bg px-3 py-2 font-mono text-code-ink placeholder:text-ink-muted"
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-sm text-ink-muted">{t.examplesLabel}:</span>
                {t.examples.map((example) => (
                  <button
                    key={example.id}
                    type="button"
                    onClick={() => setSample(example.value)}
                    className="inline-flex min-h-10 items-center rounded-full border border-stroke px-4 py-1.5 text-sm text-ink-secondary hover:border-stroke-strong"
                  >
                    {example.label}
                  </button>
                ))}
                {sample.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="ml-auto inline-flex min-h-10 items-center rounded-full border border-stroke px-4 py-1.5 text-sm text-attack hover:border-attack"
                  >
                    {t.clearAll}
                  </button>
                )}
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-ink-secondary">{t.scenarioLabel}</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {SCENARIOS.map((id: Scenario) => {
                  const active = id === scenario;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setScenario(id)}
                      title={t.scenarios[id].desc}
                      className={`inline-flex min-h-11 items-center rounded-lg border px-3.5 py-1.5 text-sm ${
                        active
                          ? 'border-accent bg-accent-soft text-ink-primary'
                          : 'border-stroke text-ink-secondary hover:border-stroke-strong'
                      }`}
                    >
                      {t.scenarios[id].name}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-ink-muted">{t.scenarios[scenario].desc}</p>
            </fieldset>

            <div aria-live="polite">
              {sample && <SampleResult key={sample} sample={sample} language={language} scenario={scenario} />}
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-stroke bg-surface p-4">
                <h2 className="font-semibold text-ink-primary">{t.lessonTitle}</h2>
                <p className="mt-2 text-sm text-ink-secondary">{t.lessonBody}</p>
              </div>
              <div className="rounded-xl border border-defense/40 bg-defense-soft p-4">
                <h2 className="font-semibold text-defense">{t.adviceTitle}</h2>
                <p className="mt-2 text-sm text-ink-secondary">{t.adviceBody}</p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
