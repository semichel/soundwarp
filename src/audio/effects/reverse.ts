// Reverses an AudioBuffer by copying and reversing each channel's Float32Array.
//
// Must be applied BEFORE passing the buffer to Tone.Offline() (AudioProcessor).
// No native "reverse" node exists in Web Audio API — this is the correct approach.
// The source buffer is NOT mutated; a new AudioBuffer is returned.

export function reverseAudioBuffer(
  ctx: AudioContext | OfflineAudioContext,
  source: AudioBuffer
): AudioBuffer {
  const reversed = ctx.createBuffer(
    source.numberOfChannels,
    source.length,
    source.sampleRate
  );
  for (let ch = 0; ch < source.numberOfChannels; ch++) {
    const channelData = new Float32Array(source.length);
    source.copyFromChannel(channelData, ch, 0);
    channelData.reverse();
    reversed.copyToChannel(channelData, ch, 0);
  }
  return reversed;
}
