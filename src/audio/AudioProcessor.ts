import * as Tone from 'tone'
import { REVEAL_LEVEL_CONFIGS, type LevelConfig, type RevealLevel } from './types'
import { reverseAudioBuffer } from './effects/reverse'
import { applyPitchShift } from './effects/pitchShift'
import { applySpeedChange } from './effects/speedChange'
import { applyReverb } from './effects/reverb'
import { applyDistortion } from './effects/distortion'
import { applyFilter } from './effects/filter'
import { createEffectCache, type EffectCache } from './effectCache'

// Pre-renders all 5 reveal levels SEQUENTIALLY using Tone.Offline().
// Sequential avoids overwhelming the browser with parallel OfflineAudioContexts.
export async function preRenderAllLevels(
  sourceBuffer: AudioBuffer
): Promise<EffectCache> {
  const cache = createEffectCache();

  for (const config of REVEAL_LEVEL_CONFIGS) {
    console.log(`[SoundWarp] Rendering level ${config.level}...`);
    const buffer = await renderSingleLevel(sourceBuffer, config);
    cache.setBuffer(config.level as RevealLevel, buffer);
  }

  console.log('[SoundWarp] All levels rendered');
  return cache;
}

// Renders one reveal level using Tone.Offline().
// If reversed: true, applies buffer reversal before the offline render.
export async function renderSingleLevel(
  sourceBuffer: AudioBuffer,
  config: LevelConfig
): Promise<AudioBuffer> {
  // Apply buffer reversal first (must happen before Tone.Offline — no reverse node in Web Audio)
  const bufferToRender = config.reversed
    ? reverseAudioBuffer(new OfflineAudioContext(1, 1, sourceBuffer.sampleRate), sourceBuffer)
    : sourceBuffer;

  const rendered = await Tone.Offline(async ({ transport }) => {
    const player = new Tone.Player(bufferToRender);
    player.toDestination();

    // Apply speed (playbackRate) — note: changes pitch proportionally at non-1.0 values
    applySpeedChange(player, config.speed);

    // Apply pitch shift (phase vocoder — independent of speed)
    if (config.pitch !== 0) {
      applyPitchShift(player, config.pitch);
    }

    // Chain effects: reverb → distortion → filter (order affects sound character)
    let lastNode: Tone.ToneAudioNode | null = null;

    if (config.reverb) {
      lastNode = await applyReverb(player);
    }
    if (config.distortion) {
      lastNode = applyDistortion(player, lastNode);
    }
    if (config.filter) {
      applyFilter(player, config.filter, lastNode);
    }

    transport.start();
    player.start(0);
  }, sourceBuffer.duration);

  const nativeBuffer = rendered.get();
  if (!nativeBuffer) {
    throw new Error(`Tone.Offline() returned null buffer for level ${config.level}`);
  }
  return nativeBuffer;
}
