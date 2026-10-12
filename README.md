# Emberkeep

A self-contained incremental tower defense game inspired by medieval keep defense.

## Play
Open `dist/index.html` in any modern browser. No installation, server, account, or external assets are required.

The game fits one screen without page scrolling. Portrait and landscape are supported; turn your phone sideways for a wider battlefield. Tower blueprints and combat controls stay visible. Workshop, Ascend, tower upgrades, and Menu open inside the game. Menu includes fullscreen where supported, help, and save settings.

Pick a blueprint, then tap a numbered building pad. Build Rangers on pads 1 and 2 and start a wave. Click a built tower to upgrade it. Gold mines earn passive income, including up to eight hours away. Every fifth wave has a boss. Finish wave 10 to unlock ascension for permanent damage and income bonuses.

- Ranger: fast single-target attacks.
- Bombard: splash damage against groups.
- Frost spire: slows enemies.
- Workshop: global damage, attack speed, and passive gold upgrades.
- Defeat: rebuild free; retain all towers and upgrades.
- Auto waves and 1×/2×/3× combat speed.
- Browser-local autosave. Saves do not sync across devices.

Keyboard: focus the battlefield and press 1–8 to select/build on a pad. Space pauses combat.

## Verify
Run `node check-game.cjs` to verify gameplay logic with a simulated DOM and drawing context. Checks include portrait and landscape tap mapping and in-game tower panels. Chromium browser checks pass at 390×844, 844×390, 320×568, 568×320, 360×640, 640×360, and 1366×768: no page overflow, visible controls, tower taps, panel navigation, workshop purchases, help, combat, and pause. Rotation also passes, with no browser errors. Portrait and landscape screenshots were visually inspected.

## Hosting
Deploy `dist/` on any static host such as GitHub Pages. GitHub Pages serves the gh-pages branch at https://semichel.github.io/soundwarp/. Publish dist/ to the root of that branch when updating the game.

