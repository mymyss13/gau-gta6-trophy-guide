// roadmap.js — the roadmap to the platinum: the order to earn the 55 trophies in, built from
// the official descriptions. Story chapters and named missions come first in story order;
// the missable-risk trophies are placed before the finale with their warnings inline; the
// stranger strands, collectibles and activity counts form the cleanup; the platinum is last
// because it is earned by earning everything else.

import { isEarned } from './tracker-state.js';

export const ROADMAP_STAGES = [
  {
    title: 'Stage 1 — Opening and Chapter 1',
    why: 'The story opens with Gone Fishing and Chapter 1. Nothing here can be missed; start the cumulative counters (stunts, choices, vehicles) from the very beginning so they never become a grind.',
    trophyIds: [2, 3],
  },
  {
    title: 'Stage 2 — Chapters 2 to 4 and the named story missions',
    why: 'Chapters 2, 3 and 4, with the named missions the descriptions list (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) earned as the story reaches them. Keep a manual save at each chapter start, and one before VCIA Takedown in particular.',
    trophyIds: [4, 5, 6, 8, 9, 10, 11, 12, 13],
  },
  {
    title: 'Stage 3 — Before the finale: the missable-risk and partner trophies',
    why: 'Do these while the story still gives you your partner and the places the descriptions name. Catch Me If You Can is tied to VCIA, the airport of VCIA Takedown; Bad Luck, I Guess needs a failed first attempt followed by a success, which a one-time moment may not offer twice; the two partner trophies need your partner beside you.',
    trophyIds: [37, 49, 33, 34],
  },
  {
    title: 'Stage 4 — The final mission and 100% completion',
    why: 'Complete the final mission (gold), then turn to A Long Road: 100% completion is fed by every stage that follows, so its last percent lands near the end of the cleanup.',
    trophyIds: [7, 14],
  },
  {
    title: 'Stage 5 — Strangers: finish all 8 strands',
    why: 'The descriptions name five final missions — for Andy, Kenton, Billy, Randy and Tyrone — and Strangers & Freaks needs 8 completed strands across Leonida, so finish those five plus three more strands. Bret\u2019s unique-animal hunt belongs with this stage too.',
    trophyIds: [22, 23, 24, 26, 27, 25, 29],
  },
  {
    title: 'Stage 6 — Collectibles and the map',
    why: 'One exploration pass across all 52 areas of Leonida serves the meditation spots (18), the Collectible Card sets (3), WAiNK (100 locations) and vehicle discoveries (100) at the same time. Register keepers to the Scooter Bros app (10) as you find them.',
    trophyIds: [42, 28, 30, 31, 35, 55],
  },
  {
    title: 'Stage 7 — Activities, mastery and money',
    why: 'Everything repeatable that is left: the Shooting Range golds (42), Top Fun wins (14 locations), 20 different races, 250 stunts, 50 challenges, the robberies, the one-off world moments, and the money totals ($250,000 laundered, $100,000 spent, all 8 garages). None of it can be missed; it is a matter of totals.',
    trophyIds: [17, 18, 19, 15, 32, 16, 20, 21, 36, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54],
  },
  {
    title: 'Stage 8 — The platinum',
    why: 'Vice Got a Price! unlocks by itself when the other 54 are earned. If it has not popped, the stage lists above show which total is still short.',
    trophyIds: [1],
  },
];

export function renderRoadmap(container, trophies, progress, onSelect) {
  container.replaceChildren();
  const byId = new Map(trophies.map((t) => [t.id, t]));
  for (const stage of ROADMAP_STAGES) {
    const section = document.createElement('section');
    section.className = 'roadmap-stage';
    const done = stage.trophyIds.filter((id) => isEarned(progress, id)).length;
    const heading = document.createElement('h2');
    const stageProgress = document.createElement('span');
    stageProgress.className = 'stage-progress';
    stageProgress.textContent = `${done}/${stage.trophyIds.length} earned`;
    heading.append(stageProgress, document.createTextNode(stage.title));
    const why = document.createElement('p');
    why.className = 'stage-why';
    why.textContent = stage.why;
    const list = document.createElement('ul');
    for (const id of stage.trophyIds) {
      const trophy = byId.get(id);
      if (!trophy) continue;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = `${isEarned(progress, id) ? '\u2713' : '\u25CB'} ${trophy.name} (${trophy.grade})`;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        onSelect(trophy);
      });
      item.append(link);
      if (trophy.missable) {
        const flag = document.createElement('span');
        flag.className = 'badge badge-missable';
        flag.textContent = 'Missable';
        item.append(document.createTextNode(' '), flag);
      }
      if (trophy.count) {
        item.append(document.createTextNode(` — ${trophy.count.toLocaleString('en-US')} total`));
      }
      list.append(item);
    }
    section.append(heading, why, list);
    container.append(section);
  }
}
