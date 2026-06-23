import { cp, copyFile, mkdir, rm } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const distSourceIndex = new URL('index.source.html', dist);
const distIndex = new URL('index.html', dist);
const rootIndex = new URL('index.html', root);
const distAssets = new URL('assets/', dist);
const rootAssets = new URL('assets/', root);

await copyFile(distSourceIndex, distIndex);
await rm(distSourceIndex, { force: true });
await rm(rootAssets, { recursive: true, force: true });
await mkdir(rootAssets, { recursive: true });
await cp(distAssets, rootAssets, { recursive: true });
await copyFile(distIndex, rootIndex);
