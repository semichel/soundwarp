import * as Tone from 'tone'

// Applies pitch shifting using Tone.PitchShift (phase vocoder).
// Called inside a Tone.Offline() callback.
// pitchSemitones: positive = higher pitch, negative = lower pitch
// Research recommendation: keep within ±7 semitones to limit artifacts (Pitfall 7).
export function applyPitchShift(
  player: Tone.Player,
  pitchSemitones: number
): void {
  if (pitchSemitones === 0) return;
  const pitchShift = new Tone.PitchShift(pitchSemitones);
  pitchShift.toDestination();
  player.disconnect();
  player.connect(pitchShift);
}
