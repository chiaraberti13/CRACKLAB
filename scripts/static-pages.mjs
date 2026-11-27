// Build a directly addressable document per lesson and a deterministic offline bundle.
import { relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { lessons, lessonIds } from '../src/lessons/catalog.ts';

const root = new URL('../dist/', import.meta.url);
const shell = await readFile(new URL('index.html', root), 'utf8');
const routes = [
  ['capisci', 'Esperimenti guidati', 'Prevedi il risultato e confronta le difese.'],
  ['progetta', 'Laboratorio sviluppatori', 'Misura il costo delle verifiche sul tuo dispositivo.'],
  ['hibp', 'Pwned Passwords', 'Verifica facoltativa di un esempio con k-anonymity.'],
  ...lessonIds.map((id) => ['capisci/' + id, lessons.it[id].title, lessons.it[id].explanation])
];
for (const [route, title, summary] of routes) {
  const dir = new URL(route + '/', root);
  await mkdir(dir, { recursive: true });
  await writeFile(
    new URL('index.html', dir),
    shell
      .replace(/<title>.*?<\/title>/, '<title>' + title + ' · CrackLab</title>')
      .replace(/(<meta\s+name="description"\s+content=")[^"]*/, '$1' + summary)
      .replace(
        '<div id="root"></div>',
        '<div id="root"><main><h1>' + title + '</h1><p>' + summary + '</p></main></div>'
      )
  );
}
const paths = (await readdir(root, { recursive: true, withFileTypes: true }))
  .filter((f) => f.isFile())
  .map((f) => '/' + relative(fileURLToPath(root), join(f.parentPath, f.name)).split('\\').join('/'))
  .filter((p) => !p.startsWith('/.') && p !== '/sw.js' && !p.endsWith('bundle-report.html'))
  .sort();
const hash = createHash('sha256');
for (const path of paths) {
  hash.update(path);
  hash.update(await readFile(new URL('.' + path, root)));
}
const cache = 'cracklab-static-' + hash.digest('hex').slice(0, 20);
await writeFile(
  new URL('sw.js', root),
  `
const key=${JSON.stringify(cache)}, paths=${JSON.stringify(paths)};
self.addEventListener('install',event=>event.waitUntil(caches.open(key).then(cache=>cache.addAll(paths))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cracklab-static-')&&k!==key).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||url.search)return;
  const path=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
  if(paths.includes(path))event.respondWith(caches.open(key).then(cache=>cache.match(path)).then(hit=>hit||fetch(event.request)));
});
`
);
