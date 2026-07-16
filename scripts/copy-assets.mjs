// Copies alphaTab runtime assets into public/ so they are served at stable URLs
// in dev and production.
//
// Why we copy the script file too:
//   alphaTab spins up a web worker for layout and an audio worklet for playback.
//   Without the official (currently broken) Vite plugin, Vite does not statically
//   detect alphaTab's indirect `new Worker(new URL('./alphaTab.worker.mjs', import.meta.url))`
//   call, so those worker files never make it into the build. alphaTab's fallback
//   path uses `settings.core.scriptFile` (driven by window.ALPHATAB_ROOT) to load a
//   self-contained classic worker via importScripts. We serve that script from
//   /alphatab/alphaTab.js and the ESM worker/worklet siblings alongside it.
//
// Runs automatically via the "predev"/"prebuild" npm scripts.
import { cpSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pkgDist = resolve(root, 'node_modules/@coderline/alphatab/dist');

// 1. Font + soundfont directories.
const dirJobs = [
  { from: resolve(pkgDist, 'font'), to: resolve(root, 'public/font') },
  { from: resolve(pkgDist, 'soundfont'), to: resolve(root, 'public/soundfont') },
];
for (const { from, to } of dirJobs) {
  if (!existsSync(from)) {
    console.error(`[copy-assets] Missing source: ${from}`);
    process.exitCode = 1;
    continue;
  }
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log(`[copy-assets] ${from} -> ${to}`);
}

// 2. alphaTab script + worker/worklet files for the classic-worker fallback.
const alphatabDir = resolve(root, 'public/alphatab');
mkdirSync(alphatabDir, { recursive: true });
const scriptFiles = [
  'alphaTab.js',
  'alphaTab.min.js',
  'alphaTab.core.mjs',
  'alphaTab.worker.mjs',
  'alphaTab.worklet.mjs',
];
for (const f of scriptFiles) {
  const from = resolve(pkgDist, f);
  if (!existsSync(from)) {
    console.warn(`[copy-assets] (skip) missing ${f}`);
    continue;
  }
  copyFileSync(from, resolve(alphatabDir, f));
}
console.log(`[copy-assets] alphaTab scripts -> ${alphatabDir}`);
