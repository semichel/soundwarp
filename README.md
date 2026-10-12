# Emberkeep

A self-contained incremental tower defense game inspired by medieval keep defense.

## Play
Open `dist/index.html` in any modern browser. No installation, server, account, or external assets are required.

The game fills one terrain-backed frame without page scrolling. The title, resources, wave status, tower choices, combat controls, and menus are all inside that frame; there is no separate page header or footer. Upright phone play is the main layout: the road runs from top to bottom on a taller battlefield, with upright tower art and correctly mapped taps. Landscape remains supported. Tower blueprints and combat controls stay visible. Workshop, Ascend, tower upgrades, and Menu open inside the game. Menu includes fullscreen where supported, help, and save settings.

Pick a blueprint, then tap any open ground on the battlefield to build freely. There are no fixed pads or eight-tower limit. Keep towers clear of the road, keep, edges, and each other. A pointer preview shows the attack range and whether placement is valid. Tap a built tower to upgrade it. Start with two Rangers near the road. Existing saves with numbered-pad towers migrate to coordinates automatically without losing upgrades.

Gold mines earn passive income, including up to eight hours away. Every fifth wave has a boss. Finish wave 10 to unlock ascension for permanent damage and income bonuses.

- Ranger: fast single-target attacks with flying arrows and bow sounds.
- Bombard: splash damage against groups with arcing shells, explosions, and deep booms.
- Frost spire: slows enemies with glowing crystals, icy rings, and shimmering chimes.
- Workshop: global damage, attack speed, and passive gold upgrades.
- Defeat: rebuild free; retain all towers and upgrades.
- Auto waves and 1×/2×/3× combat speed.
- Sound cues for building, upgrades, waves, bosses, victory, damage, defeat, and ascension. Menu includes a sound toggle and effects volume; these preferences persist separately from game progress. Audio starts after your first tap, pauses when the app is hidden, and needs no external assets.
- Browser-local autosave. Saves do not sync across devices.

Keyboard: focus the battlefield; 1–3 choose a blueprint, arrows move the placement preview, Shift + arrows move in smaller steps, and Enter builds/selects a tower. Escape clears the preview. Space pauses combat.

## Verify
Run `node check-game.cjs` to verify gameplay logic with a simulated DOM and drawing context. Checks include free placement, blocked placement without spending gold, more than eight towers, coordinate save/reload, legacy save migration, portrait and landscape tap mapping, and in-game tower panels. Chromium browser checks pass at 390×844, 844×390, 320×568, 568×320, 360×640, 640×360, and 1366×768: no page overflow, visible controls, tower taps, panel navigation, workshop purchases, help, combat, and pause. Rotation also passes, with no browser errors. Portrait and landscape screenshots were visually inspected.

## Hosting
Deploy `dist/` on any static host such as GitHub Pages. GitHub Pages serves the gh-pages branch at https://semichel.github.io/soundwarp/. Publish dist/ to the root of that branch when updating the game.

