// app.js — entry point of the Leonida Legend trophy guide & tracker. It loads the trophy
// data (app/data/trophies.json, a file of this app — nothing is fetched from the network
// beyond this app's own files), wires the checklist, filters, spoiler setting, guide panel,
// roadmap, and export/import together, and applies the view links the app itself supports
// (?demo=1 seeds a mid-game state; ?view=roadmap, ?filter=missable, ?spoiler=1 and
// ?select=<id> open the app in a given state, so a view can be shared or screenshotted).

import {
  loadProgress, saveProgress, setEarned, setCount,
  exportProgress, importProgress, demoProgress,
} from './js/tracker-state.js';
import { visibleTrophies, filterNote } from './js/filters.js';
import { renderProgress, renderList, renderGuidePanel } from './js/render-guide.js';
import { renderRoadmap } from './js/roadmap.js';

const params = new URLSearchParams(location.search);
let progress = params.has('demo') ? demoProgress() : loadProgress();
if (params.has('spoiler')) progress.spoiler = params.get('spoiler') !== '0';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

let currentFilter = params.get('filter') || 'all';
let currentQuery = '';
let selectedId = Number(params.get('select')) || 17;
let currentView = params.get('view') === 'roadmap' ? 'roadmap' : 'checklist';

const listEl = document.getElementById('trophy-list');
const panelEl = document.getElementById('guide-panel');
const noteEl = document.getElementById('filter-note');
const spoilerToggle = document.getElementById('spoiler-toggle');
spoilerToggle.checked = progress.spoiler;

const handlers = {
  onToggle(trophy, checked) {
    setEarned(progress, trophy.id, checked);
    saveProgress(progress);
    render();
  },
  onSelect(trophy) {
    selectedId = trophy.id;
    render();
  },
  onCount(trophy, value) {
    setCount(progress, trophy, value);
    saveProgress(progress);
    render();
  },
};

function selectedTrophy() {
  return trophies.find((t) => t.id === selectedId) ?? trophies[0];
}

function render() {
  renderProgress(
    trophies, progress,
    document.getElementById('progress-text'),
    document.getElementById('progress-bar'),
    document.getElementById('grade-tally'),
  );
  const visible = visibleTrophies(trophies, currentFilter, currentQuery);
  renderList(listEl, visible, progress, selectedId, handlers);
  renderGuidePanel(panelEl, selectedTrophy(), progress, handlers);
  noteEl.textContent = filterNote(currentFilter, visible.length);
  renderRoadmap(document.getElementById('roadmap'), trophies, progress, (trophy) => {
    selectedId = trophy.id;
    showView('checklist');
    render();
  });
  for (const chip of document.querySelectorAll('.chip')) {
    chip.classList.toggle('active', chip.dataset.filter === currentFilter);
  }
}

function showView(view) {
  currentView = view;
  document.getElementById('checklist-view').hidden = view !== 'checklist';
  document.getElementById('roadmap-view').hidden = view !== 'roadmap';
  document.getElementById('tab-checklist').classList.toggle('active', view === 'checklist');
  document.getElementById('tab-roadmap').classList.toggle('active', view === 'roadmap');
}

document.getElementById('tab-checklist').addEventListener('click', () => showView('checklist'));
document.getElementById('tab-roadmap').addEventListener('click', () => showView('roadmap'));
document.getElementById('filter-chips').addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  currentFilter = chip.dataset.filter;
  render();
});
document.getElementById('search').addEventListener('input', (event) => {
  currentQuery = event.target.value;
  render();
});
spoilerToggle.addEventListener('change', () => {
  progress.spoiler = spoilerToggle.checked;
  saveProgress(progress);
  render();
});
document.getElementById('export-btn').addEventListener('click', () => exportProgress(progress));
document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  progress = await importProgress(file);
  spoilerToggle.checked = progress.spoiler;
  render();
});

showView(currentView);
render();
