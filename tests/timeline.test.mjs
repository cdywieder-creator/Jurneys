import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { chapters, sceneState, frameForProgress } from '../src/timeline.mjs';

test('the journey holds each message fully visible through the middle of its chapter', () => {
  chapters.forEach((chapter, index) => {
    for (const fraction of [0.3, 0.5, 0.75]) {
      const p = chapter.start + (chapter.end - chapter.start) * fraction;
      assert.equal(sceneState(p, index).opacity, 1);
      assert.equal(sceneState(p, index).active, true);
      chapters.forEach((other, otherIndex) => { if (otherIndex !== index) assert.equal(sceneState(p, otherIndex).opacity, 0); });
    }
  });
});
test('scrolling forwards and backwards maps to film frames without autoplay', () => {
  assert.equal(frameForProgress(0, 192), 0);
  assert.equal(frameForProgress(1, 192), 191);
  assert.ok(frameForProgress(0.8, 192) > frameForProgress(0.2, 192));
  assert.equal(frameForProgress(0.2, 192), frameForProgress(0.2, 192));
  assert.equal(frameForProgress(-1, 192), 0);
  assert.equal(frameForProgress(2, 192), 191);
});
test('all 192 distinct film frames exist, and no incomplete sequence is accepted', async () => {
  const m = JSON.parse(await readFile(new URL('../public/assets/cinema/manifest.json', import.meta.url), 'utf8'));
  assert.equal(m.frameCount, 192);
  assert.equal(m.frames.length, 192);
  assert.equal(new Set(m.frames).size, 192);
  await Promise.all(m.frames.map(path => access(new URL('../public' + path, import.meta.url))));
  assert.notDeepEqual(await readFile(new URL('../public' + m.frames[0], import.meta.url)), await readFile(new URL('../public' + m.frames[100], import.meta.url)));
});
