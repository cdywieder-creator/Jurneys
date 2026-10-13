export const chapters = [
  { id: 'home', label: 'Ready for takeoff', start: 0, end: 0.145 },
  { id: 'stand-out', label: 'Stand out', start: 0.145, end: 0.285 },
  { id: 'fillpack', label: 'FillPack', start: 0.285, end: 0.465 },
  { id: 'mrbl', label: 'MRBL', start: 0.465, end: 0.645 },
  { id: 'purpose', label: 'A clear next step', start: 0.645, end: 0.805 },
  { id: 'approach', label: 'How we build yours', start: 0.805, end: 1 }
];
export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export const smoothstep = value => { const x = clamp(value); return x * x * (3 - 2 * x); };
export function sceneState(progress, index) {
  const chapter = chapters[index];
  const local = (progress - chapter.start) / (chapter.end - chapter.start);
  const enter = index === 0 ? 1 : smoothstep(local / 0.15);
  const exit = index === chapters.length - 1 ? 1 : 1 - smoothstep((local - 0.84) / 0.16);
  return { local: clamp(local), opacity: local < 0 || local > 1 ? 0 : enter * exit, active: local >= 0 && local <= 1 };
}
export function frameForProgress(progress, count) { return Math.round(clamp(progress) * (count - 1)); }
