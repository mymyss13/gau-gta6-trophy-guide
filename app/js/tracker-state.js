// tracker-state.js — the tracker's saved progress: which trophies are earned, the running
// counters for trophies that carry a count, and the spoiler setting. Everything lives in
// localStorage under one key, and can be exported to a file and imported back.

export const STORAGE_KEY = 'leonida-legend-progress-v1';

export function emptyProgress() {
  return { earned: [], counts: {}, spoiler: false };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      spoiler: Boolean(parsed.spoiler),
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isEarned(progress, trophyId) {
  return progress.earned.includes(trophyId);
}

export function setEarned(progress, trophyId, earned) {
  const has = isEarned(progress, trophyId);
  if (earned && !has) progress.earned.push(trophyId);
  if (!earned && has) progress.earned = progress.earned.filter((id) => id !== trophyId);
}

export function getCount(progress, trophy) {
  return Number(progress.counts[trophy.id] ?? 0);
}

export function setCount(progress, trophy, value) {
  const max = trophy.count ?? value;
  progress.counts[trophy.id] = Math.max(0, Math.min(max, Math.floor(value) || 0));
  // A counter that reaches its tracked total means the trophy is earned.
  if (trophy.count && progress.counts[trophy.id] >= trophy.count) setEarned(progress, trophy.id, true);
}

export function exportProgress(progress) {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function importProgress(file) {
  const parsed = JSON.parse(await file.text());
  const progress = {
    earned: Array.isArray(parsed.earned) ? parsed.earned.filter((id) => Number.isInteger(id)) : [],
    counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    spoiler: Boolean(parsed.spoiler),
  };
  saveProgress(progress);
  return progress;
}

// A plausible mid-game state used by the ?demo=1 link: the story is part-way through
// Chapter 3, a few world trophies are done, and the counters are part-filled. It exists so
// screenshots and first-time visitors can see the tracker as it looks in real use.
export function demoProgress() {
  return {
    earned: [2, 3, 4, 8, 20, 21, 36, 39, 41, 44, 46, 51],
    counts: { 15: 96, 16: 5, 17: 18, 19: 7, 25: 2, 28: 6, 31: 34, 32: 21, 35: 47, 42: 19, 48: 132, 52: 86000, 53: 41250, 55: 4 },
    spoiler: false,
  };
}
