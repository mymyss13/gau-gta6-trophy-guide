// render-guide.js — renders the checklist rows and the guide panel. Spoiler protection lives
// here: while it is on, an unearned story trophy shows a placeholder name and description
// everywhere, until it is ticked as earned.

import { isEarned, getCount } from './tracker-state.js';

export const HIDDEN_NAME = 'Hidden story trophy';
export const HIDDEN_DESCRIPTION = 'Hidden until earned — spoiler protection is on.';

export function displayName(trophy, progress) {
  if (progress.spoiler && trophy.kind === 'story' && !isEarned(progress, trophy.id)) return HIDDEN_NAME;
  return trophy.name;
}

export function displayDescription(trophy, progress) {
  if (progress.spoiler && trophy.kind === 'story' && !isEarned(progress, trophy.id)) return HIDDEN_DESCRIPTION;
  return trophy.description;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderProgress(trophies, progress, textEl, barEl, tallyEl) {
  const earnedCount = trophies.filter((t) => isEarned(progress, t.id)).length;
  const pct = Math.round((earnedCount / trophies.length) * 100);
  textEl.textContent = `${earnedCount} of ${trophies.length} earned — ${pct}% to the platinum`;
  barEl.style.width = `${pct}%`;
  const parts = ['platinum', 'gold', 'silver', 'bronze'].map((grade) => {
    const total = trophies.filter((t) => t.grade === grade).length;
    const got = trophies.filter((t) => t.grade === grade && isEarned(progress, t.id)).length;
    return `${got}/${total} ${grade}`;
  });
  tallyEl.textContent = parts.join(' · ');
}

export function renderList(listEl, trophies, progress, selectedId, handlers) {
  listEl.replaceChildren();
  for (const trophy of trophies) {
    const row = el('li');
    const button = el('button', 'trophy-row');
    button.type = 'button';
    if (trophy.id === selectedId) button.classList.add('selected');
    if (isEarned(progress, trophy.id)) button.classList.add('earned');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned(progress, trophy.id);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => handlers.onToggle(trophy, box.checked));

    const main = el('span', 'row-main');
    main.append(el('span', 'row-name', displayName(trophy, progress)));
    main.append(el('span', 'row-desc', displayDescription(trophy, progress)));

    const meta = el('span', 'row-meta');
    meta.append(el('span', `badge badge-${trophy.grade}`, trophy.grade));
    if (trophy.missable) meta.append(el('span', 'badge badge-missable', 'Missable'));
    if (trophy.count) {
      const chip = el('span', 'count-chip', `${getCount(progress, trophy)} / ${trophy.count.toLocaleString('en-US')}`);
      meta.append(chip);
    }

    button.append(box, main, meta);
    button.addEventListener('click', () => handlers.onSelect(trophy));
    row.append(button);
    listEl.append(row);
  }
}

export function renderGuidePanel(panelEl, trophy, progress, handlers) {
  panelEl.replaceChildren();
  if (!trophy) {
    panelEl.append(el('p', 'guide-placeholder', 'Select a trophy to read its guide: what to do, when it can be missed, and the sources it is built from.'));
    return;
  }
  const badges = el('p');
  badges.append(el('span', `badge badge-${trophy.grade}`, trophy.grade));
  badges.append(document.createTextNode(' '));
  badges.append(el('span', 'badge badge-kind', trophy.kind));
  if (trophy.missable) {
    badges.append(document.createTextNode(' '));
    badges.append(el('span', 'badge badge-missable', 'Missable'));
  }
  panelEl.append(badges);
  panelEl.append(el('h2', '', displayName(trophy, progress)));
  panelEl.append(el('p', 'official', `\u201C${displayDescription(trophy, progress)}\u201D — official PlayStation description`));

  if (trophy.missable) {
    const warning = el('p', 'missable-warning', 'Missable: this trophy can be left behind. Read the guide before you play past its moment.');
    panelEl.append(warning);
  }

  const spoilerHidden = progress.spoiler && trophy.kind === 'story' && !isEarned(progress, trophy.id);
  panelEl.append(el('h3', '', 'Guide'));
  panelEl.append(el('p', '', spoilerHidden
    ? 'This guide is hidden too — spoiler protection covers the whole entry for an unearned story trophy. Tick the trophy as earned, or turn spoiler protection off, to read it.'
    : trophy.guide));

  if (trophy.count) {
    panelEl.append(el('h3', '', 'Your progress'));
    const box = el('div', 'counter-box');
    const minus = el('button', '', '−');
    minus.type = 'button';
    minus.addEventListener('click', () => handlers.onCount(trophy, getCount(progress, trophy) - 1));
    const plus = el('button', '', '+');
    plus.type = 'button';
    plus.addEventListener('click', () => handlers.onCount(trophy, getCount(progress, trophy) + 1));
    const value = el('span', 'counter-value', `${getCount(progress, trophy).toLocaleString('en-US')} / ${trophy.count.toLocaleString('en-US')}`);
    box.append(minus, value, plus);
    box.append(el('span', '', ' tracked total from the official list'));
    panelEl.append(box);
  }

  panelEl.append(el('h3', '', 'Sources'));
  const list = el('ul', 'sources');
  for (const source of trophy.sources) list.append(el('li', '', source));
  panelEl.append(list);
}
