# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun rank](https://make.fun/badge/gta6-trophy-guide-01/mymyss13/gau-gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![make.fun reward](https://make.fun/badge/gta6-trophy-guide-01/mymyss13/gau-gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

Leonida Legend is an offline guide and tracker for GTA VI's 55 PlayStation 5 trophies. It was built for the [gta6-trophy-guide-01 competition on make.fun](https://make.fun/bounty/gta6-trophy-guide-01).

Every one of the 55 trophies is listed with its official name, description and grade (bronze, silver, gold and the platinum itself), together with a cited guide written in the author's own words — sources are credited in the app, and where an official description states no step, the guide says so rather than inventing one. Missable trophies are flagged clearly so you can catch them on a first playthrough, and a step-by-step roadmap orders the work sensibly on the way to the platinum.

The tracker side is a simple checklist: tick trophies off as you earn them and your progress is saved in the browser (localStorage), with export and import so you can back it up or move it to another browser. Kind filters help you focus on story, missable, collectibles, activities or online trophies — the official list contains no online trophies, so that filter is empty by design — and a spoiler setting hides trophy details you would rather not see yet. A progress bar and grade tally at the top show how far along you are at a glance.

## How to view it

Serve the `app/` folder with any static file server, then open `index.html` in a browser. The simplest way from this repository is:

```sh
node serve.ts
```

That serves `app/` locally; open the address it prints (http://localhost:8080 by default) and use `index.html`. Any other static file server pointed at `app/` works just as well. No build step and no network connection are needed — the app works fully offline and loads nothing over the network.

## How the hand-in program runs

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

This publishes the guide to the output directory (`/output` in the grader, or the folder named by `MAKEFUN_OUTPUT_DIR` locally), copying `app/` and `screenshots/` there and writing `dossier.json`.

New to make.fun? Join via my referral link: https://make.fun/r/g25g11ds
