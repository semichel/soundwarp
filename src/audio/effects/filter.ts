import * as Tone from 'tone'

// Applies a bandpass or lowpass filter using Tone.Filter (BiquadFilterNode).
// Called inside a Tone.Offline() callback.
// bandpass at 1200Hz: simulates "playing through a wall" effect
// lowpass at 3000Hz: removes high-frequency content, sounds "muffled"
export function applyFilter(
  player: Tone.Player,
  filterType: 'bandpass' | 'lowpass',
  existing: Tone.ToneAudioNode | null = null
): Tone.Filter {
  const frequency = filterType === 'bandpass' ? 1200 : 3000;
  const filter = new Tone.Filter({ type: filterType, frequency, Q: 1 });
  filter.toDestination();
  const source = existing ?? player;
  source.disconnect();
  source.connect(filter);
  return filter;
}
