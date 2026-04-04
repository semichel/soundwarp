// Fetches a Deezer preview URL via the CORS proxy and decodes it into an AudioBuffer.
//
// CRITICAL: decodeAudioData() transfers (detaches) the ArrayBuffer.
// After this call, the ArrayBuffer.byteLength === 0. Never reuse the ArrayBuffer.
// Cache the returned AudioBuffer — not the ArrayBuffer.

export async function fetchAndDecodePreview(
  proxyBaseUrl: string,
  deezerPreviewUrl: string,
  ctx: AudioContext
): Promise<AudioBuffer> {
  const proxyUrl = `${proxyBaseUrl}/api/preview?url=${encodeURIComponent(deezerPreviewUrl)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Proxy fetch failed: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  if (arrayBuffer.byteLength === 0) {
    throw new Error('Proxy returned empty response — check that the Deezer preview URL is valid');
  }
  // arrayBuffer is detached (transferred) after this call — do not reference it again
  return ctx.decodeAudioData(arrayBuffer);
}
