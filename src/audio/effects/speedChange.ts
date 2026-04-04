import * as Tone from 'tone'

// Changes playback speed using Tone.Player.playbackRate.
// NOTE: playbackRate affects pitch proportionally (pitch rises with speed).
// @soundtouchjs/audio-worklet achieves true tempo-only change but requires a live
// AudioContext (not OfflineAudioContext). This approximation is acceptable for
// the pre-render pipeline — the pitch coupling adds to the warp aesthetic.
// For accurate tempo-without-pitch, wire @soundtouchjs in the live playback path (Phase 2+).
export function applySpeedChange(
  player: Tone.Player,
  speedRatio: number
): void {
  if (speedRatio === 1.0) return;
  player.playbackRate = speedRatio;
}
