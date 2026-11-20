// filters.js — the checklist's filters: by kind (story, missable, collectibles, activities,
// online), plus a text search over names and descriptions. The official list has no online
// trophies, so the online filter honestly matches nothing.

export const FILTERS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

export function trophyMatchesFilter(trophy, filter) {
  if (filter === 'all') return true;
  if (filter === 'missable') return trophy.missable === true;
  if (filter === 'online') return trophy.kind === 'online';
  return trophy.kind === filter;
}

export function trophyMatchesSearch(trophy, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return trophy.name.toLowerCase().includes(q) || trophy.description.toLowerCase().includes(q);
}

export function visibleTrophies(trophies, filter, query) {
  return trophies.filter((t) => trophyMatchesFilter(t, filter) && trophyMatchesSearch(t, query));
}

export function filterNote(filter, count) {
  if (filter === 'online') {
    return 'The official PlayStation list for GTA VI contains no online trophies, so this filter is empty by design.';
  }
  if (filter === 'missable') {
    return 'Missable flags are this guide\u2019s reasoning from the official descriptions: a trophy tied to one mission, one place the story visits, or one first attempt. Each flagged trophy\u2019s guide explains why.';
  }
  if (filter === 'all') return '';
  return `${count} trophies in this view.`;
}
