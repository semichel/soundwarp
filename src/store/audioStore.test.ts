import { describe, it, expect, beforeEach } from 'vitest'
import { useAudioStore } from './audioStore'

// Reset store state before each test
beforeEach(() => {
  useAudioStore.setState({
    isPlaying: false,
    currentLevel: 4,
    processingState: 'idle',
    error: null,
  });
});

describe('audioStore initial state', () => {
  it('has correct defaults', () => {
    const state = useAudioStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.currentLevel).toBe(4);
    expect(state.processingState).toBe('idle');
    expect(state.error).toBeNull();
  });
});

describe('audioStore actions', () => {
  it('setPlaying(true) sets isPlaying to true', () => {
    useAudioStore.getState().setPlaying(true);
    expect(useAudioStore.getState().isPlaying).toBe(true);
  });

  it('setPlaying(false) sets isPlaying to false', () => {
    useAudioStore.getState().setPlaying(true);
    useAudioStore.getState().setPlaying(false);
    expect(useAudioStore.getState().isPlaying).toBe(false);
  });

  it('setCurrentLevel(2) updates currentLevel', () => {
    useAudioStore.getState().setCurrentLevel(2);
    expect(useAudioStore.getState().currentLevel).toBe(2);
  });

  it('setProcessingState transitions state', () => {
    useAudioStore.getState().setProcessingState('processing');
    expect(useAudioStore.getState().processingState).toBe('processing');
  });

  it('setError stores error message', () => {
    useAudioStore.getState().setError('fetch failed');
    expect(useAudioStore.getState().error).toBe('fetch failed');
  });

  it('setError(null) clears the error', () => {
    useAudioStore.getState().setError('fetch failed');
    useAudioStore.getState().setError(null);
    expect(useAudioStore.getState().error).toBeNull();
  });

  it('setProcessingState does not reset isPlaying', () => {
    useAudioStore.getState().setPlaying(true);
    useAudioStore.getState().setProcessingState('ready');
    expect(useAudioStore.getState().isPlaying).toBe(true);
  });
});
