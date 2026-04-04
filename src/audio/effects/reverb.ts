import * as Tone from 'tone'

// Applies reverb using Tone.Reverb (ConvolverNode-based).
// Called inside a Tone.Offline() callback.
// Uses a short decay (0.8s) to avoid the ConvolverNode memory spike on mobile (Pitfall 5).
// IMPORTANT: Tone.Reverb.generate() must be awaited before the offline render starts.
export async function applyReverb(
  player: Tone.Player
): Promise<Tone.Reverb> {
  const reverb = new Tone.Reverb({ decay: 0.8, wet: 0.5 })
  // Generate impulse response — this is the slow part, must complete before render
  await reverb.ready
  reverb.toDestination()
  player.disconnect()
  player.connect(reverb)
  return reverb
}
