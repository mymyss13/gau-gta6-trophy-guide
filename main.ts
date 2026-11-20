// Leonida Legend — GTA VI trophy guide & tracker: the hand-in program for gta6-trophy-guide-01.
// Written for this entry (Node 22, standard library only). It publishes the guide by copying
// this repository's app/ and screenshots/ folders into the output directory and writing the
// dossier the judge reads, using the kit's vendored buildDossier, which must stay untouched
// so the dossier matches the scorer's own byte for byte.
//
// Run locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (MAKEFUN_OUTPUT_DIR stands in for /output outside the grader.)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own (see the kit's gate): the dossier text is capped, screenshots
// are limited to 4 files of at most 256 KiB each, and app/ to 993 entries and 48 MiB.
const dossierText = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossierText);
console.log(`Leonida Legend published to ${outputDir} (dossier ${dossierText.length} bytes)`);
