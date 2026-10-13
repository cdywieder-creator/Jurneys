/** Server-side only. Uses Kie.ai Jobs API; no credential is bundled in the site. */
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const cache = new URL('../.cache/kie-generation.json', import.meta.url);
const newGeneration = process.argv.includes('--new');
if (!newGeneration && !process.env.KIE_TASK_ID) {
  try {
    await readFile(new URL('../public/assets/generated/manifest.json', import.meta.url));
    console.log('Generated artwork already exists. Use --new only when you intentionally want another paid generation.');
    process.exit(0);
  } catch {}
}
const key = process.env.KIE_API_KEY;
if (!key) { console.error('Set KIE_API_KEY securely in environment settings before generating visuals.'); process.exit(1); }
const base = 'https://api.kie.ai/api/v1/jobs';
const prompt = 'Premium editorial product photograph of a single sculptural folded paper airplane made of polished amber gold material, strong architectural folded planes with realistic warm highlights and rich amber shadows, angled upwards toward upper right, three-quarter perspective, isolated on a uniform warm ivory background hex F7F5EF, subtle soft grounding shadow, refined design studio campaign, clean minimal composition, no text, no lettering, no logos, square format, the airplane fills the frame with generous breathing room. This is the recurring hero visual for a sophisticated custom website studio.';

async function kie(path, options = {}) {
  const response = await fetch(base + path, { ...options, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Kie.ai HTTP ${response.status}. Check account access, quota, and network settings.`);
  const result = await response.json();
  if (result.code !== 200) throw new Error(`Kie.ai rejected the request (code ${result.code ?? 'unknown'}). Check the account dashboard.`);
  return result.data;
}
try {
  let taskId = process.env.KIE_TASK_ID;
  if (!taskId && !newGeneration) { try { taskId = JSON.parse(await readFile(cache, 'utf8')).taskId; } catch {} }
  if (newGeneration) { try { await unlink(new URL('../.cache/kie-cutout.json', import.meta.url)); } catch {} }
  if (!taskId) {
    const task = await kie('/createTask', { method: 'POST', body: JSON.stringify({ model: 'nano-banana-pro', input: { prompt, aspect_ratio: '1:1', resolution: '2K', output_format: 'png', image_input: [] } }) });
    taskId = task?.taskId;
    if (!taskId) throw new Error('Kie.ai did not return a task ID.');
    await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
    await writeFile(cache, JSON.stringify({ taskId }));
    console.log(`Kie.ai generation submitted. Task ID: ${taskId}`);
  } else { console.log('Resuming an existing generation task.'); }
  console.log('If interrupted, set KIE_TASK_ID to this task ID to resume without submitting again.');
  let output;
  for (let attempt = 0; attempt < 90; attempt++) {
    const task = await kie(`/recordInfo?taskId=${encodeURIComponent(taskId)}`);
    if (task.state === 'fail') throw new Error('Visual generation failed. Check this task in your Kie.ai dashboard.');
    if (task.state === 'success') {
      const result = typeof task.resultJson === 'string' ? JSON.parse(task.resultJson) : task.resultJson;
      output = result?.resultUrls?.[0];
      break;
    }
    if (attempt % 6 === 0) console.log(`Generation status: ${task.state || 'pending'}`);
    await pause(10_000);
  }
  if (!output) throw new Error(`Generation has not completed. Resume using KIE_TASK_ID=${taskId}; do not submit another paid task.`);
  const assetUrl = new URL(output);
  if (assetUrl.protocol !== 'https:') throw new Error('Kie.ai returned an insecure asset URL.');
  // Authorization is deliberately NOT forwarded to the image CDN.
  const response = await fetch(assetUrl, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Image download HTTP ${response.status}. Allow the output CDN hostname in environment network settings, then resume the same task.`);
  if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error('The generated asset response is not an image.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > 25_000_000) throw new Error('Generated image exceeds the 25 MB limit.');
  if (bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) throw new Error('Expected a PNG output.');
  const directory = fileURLToPath(new URL('../public/assets/generated/', import.meta.url));
  await mkdir(directory, { recursive: true });
  await writeFile(directory + 'plane.png', bytes);
  await writeFile(directory + 'manifest.json', JSON.stringify({ heroPlane: '/assets/generated/plane.png', model: 'nano-banana-pro', generatedAt: new Date().toISOString() }, null, 2));
  console.log('Saved public/assets/generated/plane.png. Restart the dev server or rebuild to use the generated visual.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
