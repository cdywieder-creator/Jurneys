import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const assets = new URL('../public/assets/cinema/', import.meta.url);
const cache = new URL('../.cache/kie-film.json', import.meta.url);
const prompt = `One single continuous cinematic camera shot, photorealistic luxury design studio brand film, no cuts. A vast monumental architectural gallery at golden hour: warm ivory limestone walls and flowing sculptural concrete arches, deep charcoal shadows, fine atmospheric volumetric sunlight, highly polished dark reflective floor, amber accents. A beautifully manufactured small amber-gold metal AIRCRAFT with a realistic streamlined fuselage, swept wings, cockpit and tail fins, NOT a folded paper plane, is suspended in the air at the right of the initial frame, lit with extraordinary softbox reflections, a thin luminous amber trail flowing behind it. Opening shot is already a breathtaking complete composition with dark negative space at the left for typography. Camera starts low and wide then performs a smooth forward dolly, slowly orbiting the metal aircraft, travelling through an enormous ivory arch toward a luminous amber horizon. The aircraft accelerates gently and the camera follows its trajectory into depth. Along the sides are tall floating translucent glass architectural display panels, without any imagery or text; these remain empty because website imagery will be composited later. The architecture shifts from warm ivory into cool blue-grey stone as the camera moves through the gallery and comes out into a softly glowing golden space. Real material texture, realistic depth of field, authentic film lens, sophisticated high-end commercial CGI, understated breathtaking art direction, physical lighting, controlled elegant movement. Camera moves continuously forward, no abrupt cut, no spinning, no flying backwards, no graphic text, no logos, no lettering, no people, no cartoon. Widescreen 16:9.`;
if (!process.argv.includes('--new')) {
  try { const existing = JSON.parse(await readFile(new URL('manifest.json', assets), 'utf8')); if (existing.frameCount >= 96 && existing.frames?.length === existing.frameCount) { console.log('Cinematic footage already exists; no paid job submitted.'); process.exit(0); } } catch {}
}
if (!process.env.KIE_API_KEY) { console.error('Configure KIE_API_KEY securely.'); process.exit(1); }
async function kie(path, options = {}) {
  const response = await fetch('https://api.kie.ai/api/v1/jobs' + path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.KIE_API_KEY}` }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Kie.ai HTTP ${response.status}`);
  const json = await response.json();
  if (json.code !== 200) throw new Error(`Kie.ai returned code ${json.code}. Check account access and balance.`);
  return json.data;
}
try {
  let taskId;
  if (!process.argv.includes('--new')) { try { taskId = JSON.parse(await readFile(cache, 'utf8')).taskId; } catch {} }
  if (!taskId) {
    const task = await kie('/createTask', { method: 'POST', body: JSON.stringify({ model: 'veo-3-1', input: { model: 'veo3_fast', prompt, generation_type: 'TEXT_2_VIDEO', aspect_ratio: '16:9', resolution: '720p', duration: 8, enable_translation: false } }) });
    taskId = task?.taskId;
    if (!taskId) throw new Error('No task ID returned.');
    await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
    await writeFile(cache, JSON.stringify({ taskId }));
    console.log('Cinematic generation submitted:', taskId);
  }
  let url;
  for (let i = 0; i < 120; i++) {
    const task = await kie(`/recordInfo?taskId=${encodeURIComponent(taskId)}`);
    if (task.state === 'fail') throw new Error('Generation failed. See the task in Kie.ai; do not submit another job automatically.');
    if (task.state === 'success') {
      const result = typeof task.resultJson === 'string' ? JSON.parse(task.resultJson) : task.resultJson;
      url = result?.resultUrls?.[0] || result?.data?.result_urls?.[0] || result?.data?.origin_urls?.[0];
      if (!url) throw new Error('No video URL found in the completed task result.');
      break;
    }
    if (i % 6 === 0) console.log('Film generation:', task.state || 'pending');
    await pause(10_000);
  }
  if (!url) throw new Error('Still rendering. Run the command again to resume this cached task.');
  if (new URL(url).protocol !== 'https:') throw new Error('Insecure result URL.');
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`Film download HTTP ${response.status}. Check the output CDN network settings.`);
  const source = new URL('../.cache/film-source.mp4', import.meta.url);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 1000 || bytes.length > 100_000_000) throw new Error('Unexpected film file size.');
  await writeFile(source, bytes);
  await mkdir(new URL('frames/', assets), { recursive: true });
  for (const file of await readdir(new URL('frames/', assets))) { if (/^\d{4}\.webp$/.test(file)) await unlink(new URL('frames/' + file, assets)); }
  const extracted = spawnSync('ffmpeg', ['-y', '-i', fileURLToPath(source), '-an', '-vf', 'fps=24,scale=1280:-1', '-c:v', 'libwebp', '-quality', '82', fileURLToPath(new URL('frames/', assets)) + '%04d.webp'], { encoding: 'utf8' });
  if (extracted.status !== 0) throw new Error('Frame extraction failed. Install ffmpeg with WebP support and resume this task.');
  const { copyFile } = await import('node:fs/promises');
  const frames = (await readdir(new URL('frames/', assets))).filter(file => /^\d{4}\.webp$/.test(file)).sort();
  if (frames.length < 96) throw new Error('Incomplete frame extraction: expected a full video sequence.');
  await copyFile(new URL('frames/' + frames[0], assets), new URL('poster.webp', assets));
  await writeFile(new URL('manifest.json', assets), JSON.stringify({ model: 'veo-3-1 / veo3_fast', frameRate: 24, frameCount: frames.length, width: 1280, frames: frames.map(file => '/assets/cinema/frames/' + file), poster: '/assets/cinema/poster.webp', generatedAt: new Date().toISOString() }, null, 2));
  console.log('Cinematic sequence ready:', frames.length, 'scroll-controlled frames.');
} catch (error) { console.error(error.message); process.exitCode = 1; }
