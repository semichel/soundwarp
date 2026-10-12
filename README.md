# Emberkeep

A self-contained incremental tower defense game inspired by medieval keep defense.

## Play
Open `dist/index.html` in any modern browser. No installation, server, account, or external assets are required.

Pick a blueprint, then click a numbered building pad. Build Rangers on pads 1 and 2 and start a wave. Click a built tower to upgrade it. Gold mines earn passive income, including up to eight hours away. Every fifth wave has a boss. Finish wave 10 to unlock ascension for permanent damage and income bonuses.

- Ranger: fast single-target attacks.
- Bombard: splash damage against groups.
- Frost spire: slows enemies.
- Workshop: global damage, attack speed, and passive gold upgrades.
- Defeat: rebuild free; retain all towers and upgrades.
- Auto waves and 1×/2×/3× combat speed.
- Browser-local autosave. Saves do not sync across devices.

Keyboard: focus the battlefield and press 1–8 to select/build on a pad. Space pauses combat.

## Verify
Run `node check-game.cjs` to verify gameplay logic with a simulated DOM and drawing context. Actual browser rendering has not been visually verified in this environment.

## Hosting
Deploy `dist/` on any static host such as GitHub Pages. GitHub Pages serves the gh-pages branch at https://semichel.github.io/soundwarp/. Publish dist/ to the root of that branch when updating the game.
