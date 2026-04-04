// Web Audio API mock for vitest/jsdom environment.
// jsdom does not implement Web Audio API — this provides the minimal surface
// needed to test AudioBuffer operations (createBuffer, copyFromChannel, copyToChannel).

/* eslint-disable @typescript-eslint/no-explicit-any */

class MockAudioBuffer implements AudioBuffer {
  readonly numberOfChannels: number;
  readonly length: number;
  readonly sampleRate: number;
  readonly duration: number;

  private _channels: Float32Array[];

  constructor(numberOfChannels: number, length: number, sampleRate: number) {
    this.numberOfChannels = numberOfChannels;
    this.length = length;
    this.sampleRate = sampleRate;
    this.duration = length / sampleRate;
    this._channels = Array.from({ length: numberOfChannels }, () => new Float32Array(length));
  }

  getChannelData(channel: number): Float32Array<ArrayBuffer> {
    if (channel < 0 || channel >= this.numberOfChannels) {
      throw new DOMException('channel index out of range', 'IndexSizeError');
    }
    return this._channels[channel] as Float32Array<ArrayBuffer>;
  }

  copyFromChannel(destination: Float32Array, channelNumber: number, bufferOffset = 0): void {
    const src = this._channels[channelNumber];
    const len = Math.min(destination.length, src.length - bufferOffset);
    for (let i = 0; i < len; i++) {
      destination[i] = src[bufferOffset + i];
    }
  }

  copyToChannel(source: Float32Array, channelNumber: number, bufferOffset = 0): void {
    const dst = this._channels[channelNumber];
    const len = Math.min(source.length, dst.length - bufferOffset);
    for (let i = 0; i < len; i++) {
      dst[bufferOffset + i] = source[i];
    }
  }
}

class MockBaseAudioContext {
  readonly destination = {} as AudioDestinationNode;
  readonly sampleRate: number;
  readonly currentTime = 0;
  readonly listener = {} as AudioListener;
  readonly state: AudioContextState = 'running';
  readonly audioWorklet = {} as AudioWorklet;

  constructor(sampleRate = 44100) {
    this.sampleRate = sampleRate;
  }

  createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer {
    return new MockAudioBuffer(numberOfChannels, length, sampleRate) as unknown as AudioBuffer;
  }

  createBufferSource(): AudioBufferSourceNode { return {} as AudioBufferSourceNode; }
  createGain(): GainNode { return {} as GainNode; }
  createBiquadFilter(): BiquadFilterNode { return {} as BiquadFilterNode; }
  createConvolver(): ConvolverNode { return {} as ConvolverNode; }
  createDynamicsCompressor(): DynamicsCompressorNode { return {} as DynamicsCompressorNode; }
  createWaveShaper(): WaveShaperNode { return {} as WaveShaperNode; }
  createOscillator(): OscillatorNode { return {} as OscillatorNode; }
  createAnalyser(): AnalyserNode { return {} as AnalyserNode; }
  createChannelSplitter(): ChannelSplitterNode { return {} as ChannelSplitterNode; }
  createChannelMerger(): ChannelMergerNode { return {} as ChannelMergerNode; }
  createPanner(): PannerNode { return {} as PannerNode; }
  createStereoPanner(): StereoPannerNode { return {} as StereoPannerNode; }
  createIIRFilter(): IIRFilterNode { return {} as IIRFilterNode; }
  createMediaStreamDestination(): MediaStreamAudioDestinationNode { return {} as MediaStreamAudioDestinationNode; }
  createConstantSource(): ConstantSourceNode { return {} as ConstantSourceNode; }
  createDelay(): DelayNode { return {} as DelayNode; }
  createMediaElementSource(): MediaElementAudioSourceNode { return {} as MediaElementAudioSourceNode; }
  createMediaStreamSource(): MediaStreamAudioSourceNode { return {} as MediaStreamAudioSourceNode; }
  createMediaStreamTrackSource(): any { return {} as any; }
  createPeriodicWave(): PeriodicWave { return {} as PeriodicWave; }
  createScriptProcessor(): ScriptProcessorNode { return {} as ScriptProcessorNode; }
  decodeAudioData(): Promise<AudioBuffer> { return Promise.resolve({} as AudioBuffer); }
  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean { return true; }
}

class MockAudioContext extends MockBaseAudioContext implements AudioContext {
  readonly baseLatency = 0;
  readonly outputLatency = 0;
  readonly sinkId = '';
  readonly renderCapacity = {} as any;
  onstatechange: ((this: BaseAudioContext, ev: Event) => any) | null = null;

  constructor(options?: AudioContextOptions) {
    super(options?.sampleRate ?? 44100);
  }

  close(): Promise<void> { return Promise.resolve(); }
  resume(): Promise<void> { return Promise.resolve(); }
  suspend(): Promise<void> { return Promise.resolve(); }
  setSinkId(): Promise<void> { return Promise.resolve(); }
  getOutputTimestamp(): AudioTimestamp { return { contextTime: 0, performanceTime: 0 }; }
}

class MockOfflineAudioContext extends MockBaseAudioContext implements OfflineAudioContext {
  readonly length: number;
  readonly oncomplete: ((this: OfflineAudioContext, ev: OfflineAudioCompletionEvent) => unknown) | null = null;
  onstatechange: ((this: BaseAudioContext, ev: Event) => any) | null = null;

  constructor(_numberOfChannels: number, length: number, sampleRate: number) {
    super(sampleRate);
    this.length = length;
  }

  startRendering(): Promise<AudioBuffer> { return Promise.resolve({} as AudioBuffer); }
  resume(): Promise<void> { return Promise.resolve(); }
  suspend(): Promise<void> { return Promise.resolve(); }
  addEventListener(): void {}
  removeEventListener(): void {}
  dispatchEvent(): boolean { return true; }
}

// Install globals — only if not already defined (real browser environment)
if (typeof globalThis.AudioContext === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).AudioContext = MockAudioContext;
}
if (typeof globalThis.OfflineAudioContext === 'undefined') {
  (globalThis as unknown as Record<string, unknown>).OfflineAudioContext = MockOfflineAudioContext;
}
