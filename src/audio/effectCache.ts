import type { RevealLevel } from './types'

// Stores pre-rendered AudioBuffers indexed by RevealLevel.
// One instance per game round — discard and recreate when round changes.
export interface EffectCache {
  setBuffer(level: RevealLevel, buffer: AudioBuffer): void;
  getBuffer(level: RevealLevel): AudioBuffer | undefined;
  isReady(): boolean;  // true when all 5 levels are cached
  clear(): void;
}

export function createEffectCache(): EffectCache {
  const store = new Map<RevealLevel, AudioBuffer>();
  const ALL_LEVELS: RevealLevel[] = [0, 1, 2, 3, 4];

  return {
    setBuffer(level, buffer) {
      store.set(level, buffer);
    },
    getBuffer(level) {
      return store.get(level);
    },
    isReady() {
      return ALL_LEVELS.every(level => store.has(level));
    },
    clear() {
      store.clear();
    },
  };
}
