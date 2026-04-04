// Unified music service — iTunes primary (no proxy needed), Deezer fallback (needs proxy).
// iTunes API has CORS headers → works directly from browser → no backend needed for GitHub Pages.

export interface MusicTrack {
  id: string
  title: string
  artist: string
  album: string
  cover: string
  previewUrl: string
  source: 'deezer' | 'itunes'
}

// Detect if Deezer proxy is available (local dev or Cloudflare Worker)
let _deezerAvailable: boolean | null = null
async function isDeezerAvailable(): Promise<boolean> {
  if (_deezerAvailable !== null) return _deezerAvailable
  // On GitHub Pages or static hosting, there's no proxy — skip the check
  if (window.location.hostname.includes('github.io') || window.location.protocol === 'file:') {
    _deezerAvailable = false
    console.log('[MusicService] Static hosting detected — iTunes only mode')
    return false
  }
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1500)
    const res = await fetch('/api/deezer/track/1', { signal: controller.signal })
    clearTimeout(timeoutId)
    // Check if response is JSON (not an HTML 404 page)
    const contentType = res.headers.get('content-type') ?? ''
    _deezerAvailable = res.ok && contentType.includes('json')
  } catch {
    _deezerAvailable = false
  }
  console.log(`[MusicService] Deezer proxy: ${_deezerAvailable ? 'available' : 'not available (iTunes only mode)'}`)
  return _deezerAvailable
}

// Search by query string — iTunes first (no proxy), Deezer if proxy available
export async function searchTracks(query: string, limit = 10): Promise<MusicTrack[]> {
  const results: MusicTrack[] = []

  // iTunes first — always works, no proxy needed
  try {
    const itunesResults = await searchItunes(query, limit)
    results.push(...itunesResults)
  } catch (e) {
    console.warn('[MusicService] iTunes search failed:', e)
  }

  // Fill with Deezer if proxy available and we need more
  if (results.length < limit && await isDeezerAvailable()) {
    try {
      const deezerResults = await searchDeezer(query, limit - results.length)
      results.push(...deezerResults)
    } catch (e) {
      console.warn('[MusicService] Deezer search failed:', e)
    }
  }

  return results.slice(0, limit)
}

// Get preview URL — iTunes first (direct), Deezer fallback (via proxy)
export async function getPreviewUrl(
  _trackId: number,
  title: string,
  artist: string
): Promise<{ url: string; source: 'deezer' | 'itunes' }> {
  const searchQuery = `${artist} ${title}`.trim()

  // Try iTunes first — uses JSONP to bypass CORS on mobile
  try {
    const data = await jsonpFetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=5`
    ) as { results: ItunesResult[] }
    const match = (data.results ?? []).find((t: ItunesResult) =>
      t.previewUrl && matchesTrack(t.trackName, t.artistName, title, artist)
    )
    if (match) {
      console.log(`[MusicService] iTunes match: ${match.trackName} - ${match.artistName}`)
      return { url: match.previewUrl, source: 'itunes' }
    }
    const fallback = (data.results ?? []).find((t: ItunesResult) => t.previewUrl)
    if (fallback) {
      console.log(`[MusicService] iTunes fuzzy: ${fallback.trackName} - ${fallback.artistName}`)
      return { url: fallback.previewUrl, source: 'itunes' }
    }
  } catch (e) {
    console.warn('[MusicService] iTunes search failed:', e)
  }

  // Fallback to Deezer if proxy available
  if (await isDeezerAvailable()) {
    try {
      const res = await fetch(`/api/deezer/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
      if (res.ok) {
        const data = await res.json()
        const match = (data.data ?? []).find((t: DeezerSearchResult) =>
          t.preview && matchesTrack(t.title, t.artist.name, title, artist)
        )
        if (match) {
          console.log(`[MusicService] Deezer match: ${match.title} - ${match.artist.name}`)
          return { url: match.preview, source: 'deezer' }
        }
        const fallback = (data.data ?? []).find((t: DeezerSearchResult) => t.preview)
        if (fallback) {
          console.log(`[MusicService] Deezer fuzzy: ${fallback.title} - ${fallback.artist.name}`)
          return { url: fallback.preview, source: 'deezer' }
        }
      }
    } catch (e) {
      console.warn('[MusicService] Deezer fallback failed:', e)
    }
  }

  throw new Error(`Ingen preview hittades för "${title}" av ${artist}`)
}

// Fetch audio — iTunes URLs work directly, Deezer needs proxy
export async function fetchPreviewAudio(previewUrl: string): Promise<ArrayBuffer> {
  // iTunes URLs (audio-ssl.itunes.apple.com) have CORS headers — fetch directly
  // Deezer URLs (cdnt-preview.dzcdn.net) need proxy
  const isDeezerUrl = previewUrl.includes('dzcdn.net') || previewUrl.includes('deezer')
  const fetchUrl = isDeezerUrl
    ? `/api/preview?url=${encodeURIComponent(previewUrl)}`
    : previewUrl

  const response = await fetch(fetchUrl)
  if (!response.ok) {
    throw new Error(`Audio fetch failed: ${response.status}`)
  }
  const buffer = await response.arrayBuffer()
  if (buffer.byteLength === 0) {
    throw new Error('Empty audio response')
  }
  return buffer
}

// --- Internal helpers ---

function matchesTrack(
  resultTitle: string, resultArtist: string,
  expectedTitle: string, expectedArtist: string
): boolean {
  const rt = resultTitle.toLowerCase()
  const ra = resultArtist.toLowerCase()
  const et = expectedTitle.toLowerCase()
  const ea = expectedArtist.toLowerCase().split(/[&,]/).map(s => s.trim())[0]
  return (rt.includes(et) || et.includes(rt)) && (ra.includes(ea) || ea.includes(ra))
}

interface DeezerSearchResult {
  id: number
  title: string
  artist: { name: string }
  album: { title: string; cover_small: string }
  preview: string
}

interface ItunesResult {
  trackId: number
  trackName: string
  artistName: string
  collectionName: string
  artworkUrl60: string
  previewUrl: string
}

// JSONP helper — bypasses CORS by injecting a <script> tag
// iTunes API supports JSONP via the "callback" parameter
let _jsonpCounter = 0
function jsonpFetch(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const callbackName = `_itunesJsonp_${++_jsonpCounter}`
    const script = document.createElement('script')
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('JSONP timeout'))
    }, 8000)

    function cleanup() {
      clearTimeout(timeout)
      delete (window as unknown as Record<string, unknown>)[callbackName]
      if (script.parentNode) script.parentNode.removeChild(script)
    }

    ;(window as unknown as Record<string, unknown>)[callbackName] = (data: unknown) => {
      cleanup()
      resolve(data)
    }

    script.src = `${url}&callback=${callbackName}`
    script.onerror = () => { cleanup(); reject(new Error('JSONP load failed')) }
    document.head.appendChild(script)
  })
}

async function searchDeezer(query: string, limit: number): Promise<MusicTrack[]> {
  const res = await fetch(`/api/deezer/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.data ?? [])
    .filter((t: DeezerSearchResult) => t.preview)
    .map((t: DeezerSearchResult): MusicTrack => ({
      id: `dz-${t.id}`,
      title: t.title,
      artist: t.artist.name,
      album: t.album.title,
      cover: t.album.cover_small,
      previewUrl: t.preview,
      source: 'deezer',
    }))
}

async function searchItunes(query: string, limit: number): Promise<MusicTrack[]> {
  // Use JSONP to bypass CORS (iTunes blocks fetch on mobile user agents)
  const data = await jsonpFetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}`
  ) as { results: ItunesResult[] }
  return (data.results ?? [])
    .filter((t: ItunesResult) => t.previewUrl)
    .map((t: ItunesResult): MusicTrack => ({
      id: `it-${t.trackId}`,
      title: t.trackName,
      artist: t.artistName,
      album: t.collectionName,
      cover: t.artworkUrl60,
      previewUrl: t.previewUrl,
      source: 'itunes',
    }))
}
