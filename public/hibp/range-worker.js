// Only this worker has a CSP allowing the range API. Accept a prefix, never a sample.
self.onmessage = async ({ data: prefix }) => {
  if (typeof prefix !== 'string' || !/^[0-9A-F]{5}$/.test(prefix)) return self.postMessage(null);
  try {
    const result = await fetch('https://api.pwnedpasswords.com/range/' + prefix, {
      headers: { 'Add-Padding': 'true' },
      credentials: 'omit',
      redirect: 'error',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      signal: AbortSignal.timeout(10000)
    });
    if (!result.ok) throw new Error('Range service unavailable');
    self.postMessage(await result.text());
  } catch {
    self.postMessage(null);
  }
};
