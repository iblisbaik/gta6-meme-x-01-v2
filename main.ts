// gta6-meme-x-01-v2 entry: hand POST.json (the X post's address) to the gate.
// main.ts does one thing only: copy POST.json from the repo into /output,
// canonicalizing the post address first (any query string or fragment is
// stripped; RULES.txt says a query or fragment after the post address is
// read past, so the canonical address is what the gate sees).
// The house reads the post itself from X; the judge sees the post's first
// picture (meme.png, a fake package-tracking screen) and its text. Nothing
// written here is judged, so keep this file boring and correct.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const postPath = join(botDir, 'POST.json');
const raw = readFileSync(postPath, 'utf8');
const post = JSON.parse(raw) as { url?: unknown };

if (typeof post.url !== 'string' || post.url.length === 0) {
  console.error('POST.json has no url string');
  process.exit(1);
}

// Canonicalize: drop any query string or fragment (e.g. tracking params
// X appends to shared links) before validating and copying.
const canonicalUrl = post.url.split(/[?#]/, 1)[0];

const looksLikeXPost =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(\w+\/status\/\d+|i\/web\/status\/\d+)$/.test(
    canonicalUrl,
  );
if (!looksLikeXPost) {
  console.error(`POST.json url does not look like an X post address: ${canonicalUrl}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, 'POST.json'),
  `${JSON.stringify({ ...post, url: canonicalUrl })}\n`,
);
