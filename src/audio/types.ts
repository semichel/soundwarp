// Shared type contracts for the SoundWarp audio pipeline.
// All other audio modules import from here — do not duplicate these types.

export type RevealLevel = 0 | 1 | 2 | 3 | 4;
// 0 = clean (no effects), 4 = maximum warp

export interface LevelConfig {
  level: RevealLevel;
  pitch: number;        // semitones, e.g. 7 = 7 semitones up
  speed: number;        // ratio, e.g. 0.7 = 70% speed
  reverb: boolean;
  distortion: boolean;
  filter: 'bandpass' | 'lowpass' | null;
  reversed: boolean;    // whether to apply buffer reversal before Tone.Offline render
}

export type ProcessingState = 'idle' | 'fetching' | 'processing' | 'ready' | 'error';

// The 5 reveal level configurations.
// Level 5 = hardest (all effects), Level 1 = normal clean version
// Each wrong guess goes from 5 → 4 → 3 → 2 → 1
export const REVEAL_LEVEL_CONFIGS: readonly LevelConfig[] = [
  { level: 4, pitch: 7,  speed: 0.7, reverb: true,  distortion: true,  filter: 'bandpass', reversed: true  },  // Level 5: Everything on — max warped
  { level: 3, pitch: 0,  speed: 1.0, reverb: false, distortion: false, filter: null,       reversed: true  },  // Level 4: Baklänges
  { level: 2, pitch: -8, speed: 0.5, reverb: false, distortion: false, filter: null,       reversed: false },  // Level 3: Låg pitch + långsam (svårare)
  { level: 1, pitch: 10, speed: 1.8, reverb: false, distortion: false, filter: null,       reversed: false },  // Level 2: Hög pitch + snabb (lättare)
  { level: 0, pitch: 0,  speed: 1.0, reverb: false, distortion: false, filter: null,       reversed: false },  // Level 1: Normalt
] as const;

export interface AudioEngineState {
  isPlaying: boolean;
  currentLevel: RevealLevel;
  processingState: ProcessingState;
  cachedBuffers: Partial<Record<RevealLevel, AudioBuffer>>;
  error: string | null;
}
