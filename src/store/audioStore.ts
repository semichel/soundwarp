import { create } from 'zustand'
import type { RevealLevel, ProcessingState } from '../audio/types'

interface AudioState {
  isPlaying: boolean;
  currentLevel: RevealLevel;
  processingState: ProcessingState;
  error: string | null;

  // Actions
  setPlaying: (playing: boolean) => void;
  setCurrentLevel: (level: RevealLevel) => void;
  setProcessingState: (state: ProcessingState) => void;
  setError: (error: string | null) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  // Initial state: most warped level active, nothing loaded
  isPlaying: false,
  currentLevel: 4,
  processingState: 'idle',
  error: null,

  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentLevel: (level) => set({ currentLevel: level }),
  setProcessingState: (state) => set({ processingState: state }),
  setError: (error) => set({ error }),
}));
