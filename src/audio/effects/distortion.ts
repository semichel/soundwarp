import * as Tone from 'tone'

// Applies distortion using Tone.Distortion (WaveShaperNode).
// Called inside a Tone.Offline() callback.
// distortion value 0.4 = moderate — audible but not unrecognizable at high warp levels.
export function applyDistortion(
  player: Tone.Player,
  existing: Tone.ToneAudioNode | null = null
): Tone.Distortion {
  const distortion = new Tone.Distortion(0.4);
  distortion.toDestination();
  const source = existing ?? player;
  source.disconnect();
  source.connect(distortion);
  return distortion;
}
