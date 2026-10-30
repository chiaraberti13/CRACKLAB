import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

/**
 * CrackLab's privacy promise is enforceable only if the code cannot quietly send
 * the input anywhere or persist it. These selectors make the unsafe sinks a lint
 * error, so an accidental `fetch`, DOM-HTML injection or browser-storage write
 * fails CI instead of silently shipping. The only reviewed exceptions live in
 * src/store.ts (versioned preference allowlist) and, later, an opt-in HIBP range
 * request documented in .github/security-exceptions.yml.
 */
const unsafeFrontendSyntax = [
  {
    selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
    message: 'Render text through React escaping; dangerouslySetInnerHTML is not allowed.'
  },
  {
    selector: "Property[key.name='dangerouslySetInnerHTML']",
    message: 'Passing dangerouslySetInnerHTML through an object or spread is not allowed.'
  },
  {
    selector: "JSXAttribute[name.name='srcDoc']",
    message: 'Inline iframe HTML is not allowed.'
  },
  {
    selector: "AssignmentExpression[left.type='MemberExpression'][left.property.name=/^(innerHTML|outerHTML|srcdoc)$/]",
    message: 'Unsafe HTML assignment is not allowed; use textContent or React rendering.'
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.property.name=/^(insertAdjacentHTML|setHTMLUnsafe|createContextualFragment)$/]",
    message: 'Unsafe HTML parsing or insertion is not allowed.'
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.name='document'][callee.property.name=/^(write|writeln)$/]",
    message: 'document.write is an unsafe DOM sink and is not allowed.'
  },
  {
    selector: "CallExpression[callee.name='fetch']",
    message:
      'Network access is deny-by-default (privacy promise); document and review an exception before adding fetch.'
  },
  {
    selector: "CallExpression[callee.type='MemberExpression'][callee.property.name='fetch']",
    message:
      'Network access is deny-by-default (privacy promise); document and review an exception before adding fetch.'
  },
  {
    selector: "CallExpression[callee.type='MemberExpression'][callee.property.value='fetch']",
    message:
      'Network access is deny-by-default (privacy promise); document and review an exception before adding fetch.'
  },
  {
    selector: 'NewExpression[callee.name=/^(XMLHttpRequest|WebSocket|EventSource)$/]',
    message: 'Network access is deny-by-default (privacy promise); document and review an exception first.'
  },
  {
    selector:
      "NewExpression[callee.type='MemberExpression'][callee.property.name=/^(XMLHttpRequest|WebSocket|EventSource)$/]",
    message: 'Network access is deny-by-default (privacy promise); document and review an exception first.'
  },
  {
    selector:
      "CallExpression[callee.type='MemberExpression'][callee.object.name='navigator'][callee.property.name='sendBeacon']",
    message: 'Telemetry and network beacons are not allowed without an explicit reviewed exception.'
  }
];

const restrictedPersistenceSyntax = [
  {
    selector: "Identifier[name='localStorage']",
    message: 'localStorage is allowed only in src/store.ts, for non-sensitive UI preferences; never for password input.'
  },
  {
    selector: "MemberExpression[property.value='localStorage']",
    message: 'localStorage is allowed only in src/store.ts, for non-sensitive UI preferences; never for password input.'
  },
  {
    selector: 'Identifier[name=/^(sessionStorage|indexedDB)$/]',
    message: 'Unreviewed browser persistence is not allowed; the sample input must never be persisted.'
  },
  {
    selector: "MemberExpression[object.name='document'][property.name='cookie']",
    message: 'Client-side cookie access is not allowed in this static application.'
  }
];

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules', 'playwright-report', 'test-results'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Unused code is dead weight in a teaching codebase; an underscore marks intent.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Content and model datasets are data, so object shapes are declared, never inferred as `any`.
      '@typescript-eslint/no-explicit-any': 'error',
      eqeqeq: ['error', 'smart'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-restricted-syntax': ['error', ...unsafeFrontendSyntax, ...restrictedPersistenceSyntax]
    }
  },
  {
    // The store owns the only approved persistence boundary: a versioned,
    // allowlisted preference schema (language, theme, scenario) that never
    // touches the sample input. It keeps the storage-identifier restrictions off
    // but all other guardrails on.
    files: ['src/store.ts'],
    rules: {
      'no-restricted-syntax': ['error', ...unsafeFrontendSyntax, ...restrictedPersistenceSyntax.slice(2)]
    }
  },
  {
    // Node-run scripts (verification gates) are not browser components.
    files: ['scripts/**/*.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      'no-restricted-syntax': 'off',
      'no-console': 'off'
    }
  },
  {
    // Tests may reach for Node globals and are not components.
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'react-refresh/only-export-components': 'off',
      // Tests may exercise browser storage in isolated jsdom instances. Runtime
      // source remains subject to the persistence restrictions above.
      'no-script-url': 'off',
      'no-restricted-syntax': ['error', ...unsafeFrontendSyntax]
    }
  },
  {
    // End-to-end specs and the Playwright config are Node-run harness code. They
    // drive the browser through Playwright and touch the DOM only inside
    // `page.evaluate`, so they keep the unsafe DOM-sink guardrails but drop the
    // component and persistence restrictions.
    files: ['e2e/**/*.ts', 'playwright.config.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-restricted-syntax': ['error', ...unsafeFrontendSyntax]
    }
  }
);
