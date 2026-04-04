import { describe, it, expect, beforeEach } from 'vitest'
import { reverseAudioBuffer } from './reverse'

// Use a real OfflineAudioContext — no mocking needed for buffer operations
let ctx: OfflineAudioContext;
let sourceBuffer: AudioBuffer;

beforeEach(() => {
  ctx = new OfflineAudioContext(1, 100, 44100);
  sourceBuffer = ctx.createBuffer(1, 4, 44100);
  const data = sourceBuffer.getChannelData(0);
  data[0] = 0.1;
  data[1] = 0.2;
  data[2] = 0.3;
  data[3] = 0.4;
});

describe('reverseAudioBuffer', () => {
  it('returns buffer with same shape as source', () => {
    const reversed = reverseAudioBuffer(ctx, sourceBuffer);
    expect(reversed.numberOfChannels).toBe(sourceBuffer.numberOfChannels);
    expect(reversed.length).toBe(sourceBuffer.length);
    expect(reversed.sampleRate).toBe(sourceBuffer.sampleRate);
  });

  it('first sample of reversed equals last sample of source', () => {
    const reversed = reverseAudioBuffer(ctx, sourceBuffer);
    expect(reversed.getChannelData(0)[0]).toBeCloseTo(0.4, 5);
  });

  it('last sample of reversed equals first sample of source', () => {
    const reversed = reverseAudioBuffer(ctx, sourceBuffer);
    const lastIndex = reversed.length - 1;
    expect(reversed.getChannelData(0)[lastIndex]).toBeCloseTo(0.1, 5);
  });

  it('does not mutate the source buffer', () => {
    reverseAudioBuffer(ctx, sourceBuffer);
    expect(sourceBuffer.getChannelData(0)[0]).toBeCloseTo(0.1, 5);
    expect(sourceBuffer.getChannelData(0)[3]).toBeCloseTo(0.4, 5);
  });
});
