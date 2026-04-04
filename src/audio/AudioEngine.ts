// Singleton AudioContext for the entire app lifetime.
//
// CRITICAL: Never call `new AudioContext()` outside getAudioContext().
// iOS Safari requires AudioContext to be created inside a user-gesture handler.
// _ctx is null at module load time — this is intentional.

let _ctx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export function getAudioContext(): AudioContext {
  if (!_ctx) {
    _ctx = new AudioContext({ sampleRate: 44100 });
  }
  return _ctx;
}

// Call this inside every user-gesture handler before playing audio.
// Guards against the suspended state that iOS creates when the context
// is first accessed (even if created inside a gesture on some iOS versions).
export async function ensureAudioContextRunning(): Promise<AudioContext> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

// Play a pre-rendered AudioBuffer.
// Creates a FRESH AudioBufferSourceNode each call — nodes are single-use.
// Stops and disconnects any currently playing source first.
export function playBuffer(buffer: AudioBuffer): AudioBufferSourceNode {
  const ctx = getAudioContext();
  if (currentSource) {
    try { currentSource.stop(); } catch { /* already stopped */ }
    currentSource.disconnect();
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
  currentSource = source;
  return source;
}

// Pause playback by suspending the AudioContext.
// Resume by calling ensureAudioContextRunning() + playBuffer() again.
export function pausePlayback(): void {
  if (_ctx && _ctx.state === 'running') {
    _ctx.suspend();
  }
}

// Stop and fully disconnect the current source.
// Use when changing reveal level or ending a round.
export function stopPlayback(): void {
  if (currentSource) {
    try { currentSource.stop(); } catch { /* already stopped */ }
    currentSource.disconnect();
    currentSource = null;
  }
}

// Returns the singleton AudioContext if already created, null otherwise.
// Use in components that need to check context state without creating it.
export function getAudioContextIfExists(): AudioContext | null {
  return _ctx;
}
