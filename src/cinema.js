import { chapters, clamp, sceneState, frameForProgress, smoothstep } from './timeline.mjs';
import { asset } from './assets.js';

export function setupCinema() {
  const story = document.querySelector('.film-story');
  const stage = document.querySelector('.film-stage');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const canvas = document.querySelector('.movie-canvas');
  const context = canvas.getContext('2d', { alpha: false });
  const toggle = document.querySelector('.motion-toggle');
  const hud = toggle.parentElement;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapterLinks = [...document.querySelectorAll('.chapter-track a')];
  const cache = new Map();
  const pending = new Set();
  const failures = new Set();
  let manifest;
  let reading = false;
  let progress = 0;
  let target = 0;
  let animation = 0;
  let drawn = -1;
  let activeIndex = 0;
  let travel = 1;
  let resized = true;
  const mobile = () => innerWidth <= 760;

  function measure() {
    travel = Math.max(1, story.offsetHeight - stage.offsetHeight);
    if (!reading) {
      const ratio = Math.min(devicePixelRatio || 1, mobile() ? 1.25 : 1.5);
      canvas.width = Math.round(stage.clientWidth * ratio);
      canvas.height = Math.round(stage.clientHeight * ratio);
      document.querySelectorAll('.chapter-anchor').forEach(anchor => {
        const chapter = chapters[Number(anchor.dataset.chapter)];
        anchor.style.top = `${travel * (chapter.start + 0.035)}px`;
      });
      resized = true;
    }
    updateTarget();
  }
  function updateTarget() {
    if (reading) return;
    target = clamp((scrollY - story.offsetTop) / travel);
    requestRender();
  }
  function requestRender() {
    if (!animation && !reading && !document.hidden) animation = requestAnimationFrame(render);
  }
  function trim() {
    const max = mobile() ? 8 : 14;
    if (cache.size <= max) return;
    const goal = frameForProgress(target, manifest.frameCount);
    const ranked = [...cache.keys()].sort((a, b) => Math.abs(b - goal) - Math.abs(a - goal));
    while (cache.size > max) { const index = ranked.shift(); cache.get(index)?.close?.(); cache.delete(index); }
  }
  async function loadFrame(index) {
    if (!manifest || reading || index < 0 || index >= manifest.frameCount || cache.has(index) || pending.has(index) || failures.has(index) || pending.size >= 6) return;
    pending.add(index);
    try {
      const response = await fetch(manifest.frames[index], { cache: 'force-cache' });
      if (!response.ok) throw new Error('Frame unavailable');
      const blob = await response.blob();
      let image;
      if (typeof createImageBitmap === 'function') image = await createImageBitmap(blob);
      else {
        image = new Image();
        const objectUrl = URL.createObjectURL(blob);
        try { image.src = objectUrl; await image.decode(); } finally { URL.revokeObjectURL(objectUrl); }
      }
      cache.set(index, image);
      trim();
      requestRender();
    } catch { failures.add(index); }
    finally {
      pending.delete(index);
      const desired = manifest ? frameForProgress(target, manifest.frameCount) : 0;
      if (!cache.has(desired)) loadFrame(desired);
    }
  }
  function draw(index) {
    if (!context || !cache.size) return;
    const closest = cache.has(index) ? index : [...cache.keys()].sort((a, b) => Math.abs(a - index) - Math.abs(b - index))[0];
    if (drawn === closest && !resized) return;
    const image = cache.get(closest);
    const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    const focalX = mobile() ? 0.59 : 0.5;
    context.drawImage(image, (canvas.width - width) * focalX, (canvas.height - height) / 2, width, height);
    canvas.dataset.frame = String(closest);
    canvas.classList.add('is-ready');
    drawn = closest;
    resized = false;
  }
  function updateScenes() {
    scenes.forEach((scene, index) => {
      const state = sceneState(progress, index);
      scene.style.opacity = state.opacity.toFixed(4);
      scene.style.setProperty('--scene-y', `${(1 - smoothstep(state.local / 0.2)) * 35}px`);
      const readable = state.active && state.opacity > 0.05;
      scene.classList.toggle('is-active', readable);
      scene.inert = !readable;
      scene.setAttribute('aria-hidden', readable ? 'false' : 'true');
      const entering = 1 - smoothstep(state.local / 0.28);
      const leaving = smoothstep((state.local - 0.8) / 0.2);
      const direction = index === 3 ? -1 : 1;
      scene.style.setProperty('--work-x', `${entering * 160 * direction - leaving * 100 * direction}px`);
      scene.style.setProperty('--work-y', `${entering * 85 - leaving * 45}px`);
      scene.style.setProperty('--work-scale', `${1 - entering * 0.24 + leaving * 0.1}`);
      scene.style.setProperty('--work-bank', `${(entering * 25 + 7) * -direction}deg`);
      if (state.active) activeIndex = index;
    });
    document.querySelector('.current-chapter').textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${chapters[activeIndex].label.toUpperCase()}`;
    chapterLinks.forEach((link, index) => {
      const chapter = chapters[index];
      link.style.setProperty('--chapter-fill', clamp((progress - chapter.start) / (chapter.end - chapter.start)));
      if (index === activeIndex) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
    });
    const cool = smoothstep((progress - 0.43) / 0.12) * (1 - smoothstep((progress - 0.72) / 0.09));
    stage.style.setProperty('--cool', cool.toFixed(3));
    stage.dataset.progress = progress.toFixed(4);
    stage.dataset.chapter = String(activeIndex);
  }
  function render() {
    animation = 0;
    if (reading) return;
    // A brief camera easing follows native scrolling; no wheel or touch interception.
    progress += (target - progress) * 0.22;
    if (Math.abs(target - progress) < 0.00005) progress = target;
    updateScenes();
    if (manifest) {
      const frame = frameForProgress(progress, manifest.frameCount);
      loadFrame(frame);
      draw(frame);
      for (let offset = 1; offset <= (mobile() ? 1 : 2); offset++) { loadFrame(frame + offset); loadFrame(frame - offset); }
    }
    if (Math.abs(target - progress) > 0.00005) requestRender();
  }
  function setReading(value, reposition = false) {
    let current = activeIndex;
    if (reading && !value) {
      current = scenes.reduce((best, scene, index) => Math.abs(scene.getBoundingClientRect().top) < Math.abs(scenes[best].getBoundingClientRect().top) ? index : best, 0);
    }
    reading = value;
    document.body.classList.toggle('reading-mode', value);
    toggle.setAttribute('aria-pressed', String(value));
    toggle.textContent = value ? 'Return to cinematic journey' : 'Less motion';
    if (value) {
      cancelAnimationFrame(animation); animation = 0;
      document.body.append(toggle);
      scenes.forEach((scene, index) => {
        scene.inert = false;
        scene.removeAttribute('aria-hidden');
        if (manifest) scene.style.setProperty('--chapter-image', `url('${manifest.frames[frameForProgress((chapters[index].start + chapters[index].end) / 2, manifest.frameCount)]}')`);
      });
      if (reposition) scrollTo({ top: scenes[current].getBoundingClientRect().top + scrollY, behavior: 'instant' });
    } else {
      hud.append(toggle);
      measure();
      if (reposition) { progress = chapters[current].start + (chapters[current].end - chapters[current].start) * 0.35; scrollTo({ top: story.offsetTop + progress * travel, behavior: 'instant' }); }
      updateTarget();
    }
  }
  toggle.addEventListener('click', () => setReading(!reading, true));
  prefersReduced.addEventListener('change', event => setReading(event.matches, true));
  addEventListener('scroll', updateTarget, { passive: true });
  addEventListener('resize', measure, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestRender(); });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    if (!reading) return;
    const targetId = link.hash.slice(1);
    const index = targetId === 'work' ? 2 : chapters.findIndex(chapter => chapter.id === targetId);
    if (index < 0) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    scenes[index].scrollIntoView({ behavior: 'instant', block: 'start' });
  }));
  fetch(asset('/assets/cinema/manifest.json')).then(response => { if (!response.ok) throw new Error('Film manifest unavailable'); return response.json(); }).then(value => {
    if (!Array.isArray(value.frames) || value.frameCount !== value.frames.length || value.frameCount < 2 || value.frames.some(path => !path.startsWith('/assets/cinema/frames/'))) throw new Error('Invalid film manifest');
    value.frames = value.frames.map(asset);
    manifest = value;
    stage.dataset.frameCount = String(value.frameCount);
    if (reading) setReading(true); else { loadFrame(0); requestRender(); }
    document.querySelector('.contact-atmosphere').style.backgroundImage = `url('${value.frames.at(-1)}')`;
  }).catch(() => { stage.dataset.filmStatus = 'unavailable'; });
  setReading(prefersReduced.matches);
  measure();
  // Deep links must advance the sequence after the native chapter anchors are positioned.
  if (location.hash && !reading) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
}
