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

// Cloudflare Worker proxy URL — works from any device (mobile + desktop)
const PROXY_URL = import.meta.env.VITE_PROXY_URL ?? 'https://soundwarp-api.semichel.workers.dev'

// Search by query string — tries both iTunes and Deezer via proxy
export async function searchTracks(query: string, limit = 10): Promise<MusicTrack[]> {
  const results: MusicTrack[] = []

  // iTunes first via proxy
  try {
    const itunesResults = await searchItunes(query, limit)
    results.push(...itunesResults)
  } catch (e) {
    console.warn('[MusicService] iTunes search failed:', e)
  }

  // Fill with Deezer if needed
  if (results.length < limit) {
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

  // Try iTunes first via proxy
  try {
    const res = await fetch(`${PROXY_URL}/api/itunes/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=5`)
    if (!res.ok) throw new Error(`iTunes search failed: ${res.status}`)
    const data = await res.json() as { results: ItunesResult[] }
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

  // Fallback to Deezer via proxy
  try {
    const res = await fetch(`${PROXY_URL}/api/deezer/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
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

  throw new Error(`Ingen preview hittades för "${title}" av ${artist}`)
}

// Fetch audio via Cloudflare proxy (handles both Deezer and iTunes URLs)
export async function fetchPreviewAudio(previewUrl: string): Promise<ArrayBuffer> {
  const fetchUrl = `${PROXY_URL}/api/preview?url=${encodeURIComponent(previewUrl)}`
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

async function searchDeezer(query: string, limit: number): Promise<MusicTrack[]> {
  const res = await fetch(`${PROXY_URL}/api/deezer/search?q=${encodeURIComponent(query)}&limit=${limit}`)
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
  const res = await fetch(`${PROXY_URL}/api/itunes/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}`)
  if (!res.ok) return []
  const data = await res.json() as { results: ItunesResult[] }
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
