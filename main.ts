// gta6-meme-x-01-v2 entry: hand POST.json (the X post's address) to the gate.
// main.ts does one thing only: copy POST.json from the repo into /output.
// The house reads the post itself from X; the judge sees the post's first
// picture (meme.png, a fake package-tracking screen) and its text. Nothing
// written here is judged, so keep this file boring and correct.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
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

const looksLikeXPost =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url);
if (!looksLikeXPost) {
  console.error(`POST.json url does not look like an X post address: ${post.url}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(postPath, join(outDir, 'POST.json'));
