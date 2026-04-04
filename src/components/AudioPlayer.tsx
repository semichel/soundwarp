import { useRef, useCallback, useState } from 'react'
import { useAudioStore } from '../store/audioStore'
import {
  ensureAudioContextRunning,
  playBuffer,
  pausePlayback,
  stopPlayback,
} from '../audio/AudioEngine'
import { preRenderAllLevels } from '../audio/AudioProcessor'
import type { EffectCache } from '../audio/effectCache'
import type { RevealLevel } from '../audio/types'
import { CATEGORIES, getRandomTrack, markAsPlayed, resetHistory, getRemainingCount, getPlayedCount, getTotalTrackCount, type TrackEntry } from '../data/trackDb'
import { searchTracks, getPreviewUrl, fetchPreviewAudio, type MusicTrack } from '../audio/MusicService'

const LEVEL_LABELS: Record<number, string> = {
  4: '🤯 Nivå 5 — Allt på',
  3: '🔄 Nivå 4 — Baklänges',
  2: '🐌 Nivå 3 — Låg pitch + långsam',
  1: '⚡ Nivå 2 — Hög pitch + snabb',
  0: '🎵 Nivå 1 — Normalt',
}

const MAX_GUESSES = 5

type GameState = 'menu' | 'loading' | 'playing' | 'won' | 'lost'

export function AudioPlayer() {
  const {
    isPlaying,
    processingState,
    error,
    setPlaying,
    setProcessingState,
    setError,
  } = useAudioStore()
  const cacheRef = useRef<EffectCache | null>(null)

  // Game state
  const [gameState, setGameState] = useState<GameState>('menu')
  const [currentGuessNum, setCurrentGuessNum] = useState(0) // 0-4
  const [guesses, setGuesses] = useState<string[]>([])
  const [selectedTrack, setSelectedTrack] = useState<TrackEntry | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [audioSource, setAudioSource] = useState<'deezer' | 'itunes' | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<MusicTrack[]>([])
  const [searching, setSearching] = useState(false)

  // Multiple choice options
  const [choices, setChoices] = useState<TrackEntry[]>([])

  // Current reveal level based on guess number (5 → 4 → 3 → 2 → 1)
  const currentLevel = (4 - currentGuessNum) as RevealLevel

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const results = await searchTracks(searchQuery, 8)
      setSearchResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setSearching(false)
    }
  }, [searchQuery, setError])

  const handleSelectSearchResult = useCallback((result: MusicTrack) => {
    setSelectedTrack({
      id: result.source === 'deezer' ? parseInt(result.id.replace('dz-', '')) : 0,
      title: result.title,
      artist: result.artist,
      _previewUrl: result.previewUrl,
      _source: result.source,
    } as TrackEntry & { _previewUrl?: string; _source?: string })
    setSearchResults([])
    setSearchQuery('')
  }, [])

  const handleCategoryClick = useCallback((categoryKey: string) => {
    setActiveCategory(categoryKey)
    const track = getRandomTrack(categoryKey)
    if (track) setSelectedTrack(track)
  }, [])

  const generateChoices = useCallback((correctTrack: TrackEntry, categoryKey: string | null): TrackEntry[] => {
    // Get all tracks from all categories as wrong answer pool
    const allTracks = CATEGORIES.flatMap(c => c.tracks)
    // Prefer same category for harder choices
    const sameCat = categoryKey ? (CATEGORIES.find(c => c.key === categoryKey)?.tracks ?? []) : []
    const pool = sameCat.length >= 5 ? sameCat : allTracks

    const wrongAnswers = pool
      .filter(t => t.id !== correctTrack.id && t.title !== correctTrack.title)

    // Shuffle and pick 9
    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 9)

    // Add correct answer and shuffle all 5
    return [...shuffled, correctTrack].sort(() => Math.random() - 0.5)
  }, [])

  const startGame = useCallback(async (overrideTrack?: TrackEntry | null) => {
    const track = overrideTrack ?? selectedTrack ?? getRandomTrack(activeCategory ?? 'pop')
    if (!track) return

    setSelectedTrack(track)
    setGameState('loading')
    setCurrentGuessNum(0)
    setGuesses([])
    setChoices(generateChoices(track, activeCategory))

    try {
      const ctx = await ensureAudioContextRunning()
      setProcessingState('fetching')
      setError(null)

      const trackAny = track as TrackEntry & { _previewUrl?: string; _source?: string }
      let previewUrl: string
      let source: 'deezer' | 'itunes'

      if (trackAny._previewUrl) {
        previewUrl = trackAny._previewUrl
        source = (trackAny._source as 'deezer' | 'itunes') ?? 'deezer'
      } else {
        const result = await getPreviewUrl(track.id, track.title, track.artist)
        previewUrl = result.url
        source = result.source
      }

      setAudioSource(source)
      const arrayBuffer = await fetchPreviewAudio(previewUrl)
      const sourceBuffer = await ctx.decodeAudioData(arrayBuffer)

      setProcessingState('processing')
      const cache = await preRenderAllLevels(sourceBuffer)
      cacheRef.current = cache

      setProcessingState('ready')
      setGameState('playing')
      markAsPlayed(track.id)

      // Auto-play level 5 (most warped)
      const buffer = cache.getBuffer(4)
      if (buffer) {
        await ensureAudioContextRunning()
        playBuffer(buffer)
        setPlaying(true)
      }
    } catch (err) {
      setProcessingState('error')
      setError(err instanceof Error ? err.message : 'Failed to load')
      setGameState('menu')
    }
  }, [selectedTrack, activeCategory, setProcessingState, setError, setPlaying])

  const handlePlay = useCallback(async () => {
    if (!cacheRef.current) return
    const buffer = cacheRef.current.getBuffer(currentLevel)
    if (!buffer) return
    await ensureAudioContextRunning()
    playBuffer(buffer)
    setPlaying(true)
  }, [currentLevel, setPlaying])

  const handlePause = useCallback(() => {
    pausePlayback()
    setPlaying(false)
  }, [setPlaying])

  const handleReplay = useCallback(async () => {
    if (!cacheRef.current) return
    const buffer = cacheRef.current.getBuffer(currentLevel)
    if (!buffer) return
    stopPlayback()
    await ensureAudioContextRunning()
    playBuffer(buffer)
    setPlaying(true)
  }, [currentLevel, setPlaying])

  const handleChoiceClick = useCallback((choice: TrackEntry) => {
    if (!selectedTrack) return
    const correct = choice.id === selectedTrack.id || choice.title === selectedTrack.title
    const label = `${choice.title} — ${choice.artist}`

    setGuesses(prev => [...prev, label])

    if (correct) {
      stopPlayback()
      setPlaying(false)
      setGameState('won')
      setTimeout(async () => {
        const cleanBuffer = cacheRef.current?.getBuffer(0)
        if (cleanBuffer) {
          await ensureAudioContextRunning()
          playBuffer(cleanBuffer)
        }
      }, 500)
      return
    }

    const nextGuessNum = currentGuessNum + 1
    if (nextGuessNum >= MAX_GUESSES) {
      stopPlayback()
      setPlaying(false)
      setGameState('lost')
      return
    }

    setCurrentGuessNum(nextGuessNum)

    const nextLevel = (4 - nextGuessNum) as RevealLevel
    const buffer = cacheRef.current?.getBuffer(nextLevel)
    if (buffer) {
      stopPlayback()
      ensureAudioContextRunning().then(() => {
        playBuffer(buffer)
        setPlaying(true)
      })
    }
  }, [selectedTrack, currentGuessNum, setPlaying])


  const handleSkip = useCallback(() => {
    const nextGuessNum = currentGuessNum + 1
    setGuesses(prev => [...prev, '⏭ Skippade'])

    if (nextGuessNum >= MAX_GUESSES) {
      stopPlayback()
      setPlaying(false)
      setGameState('lost')
      return
    }

    setCurrentGuessNum(nextGuessNum)

    const nextLevel = (4 - nextGuessNum) as RevealLevel
    const buffer = cacheRef.current?.getBuffer(nextLevel)
    if (buffer) {
      stopPlayback()
      ensureAudioContextRunning().then(() => {
        playBuffer(buffer)
        setPlaying(true)
      })
    }
  }, [currentGuessNum, setPlaying])

  const handleBackToMenu = useCallback(() => {
    stopPlayback()
    setPlaying(false)
    setGameState('menu')
    setProcessingState('idle')
    cacheRef.current = null
  }, [setPlaying, setProcessingState])

  const handleNextRound = useCallback(() => {
    stopPlayback()
    setPlaying(false)
    setProcessingState('idle')
    cacheRef.current = null

    if (activeCategory) {
      const next = getRandomTrack(activeCategory)
      if (next) {
        startGame(next)
        return
      }
    }
    setGameState('menu')
  }, [activeCategory, setPlaying, setProcessingState, startGame])

  // ========== RENDER ==========

  // MENU
  if (gameState === 'menu') {
    return (
      <div className="flex flex-col items-center gap-6 p-6 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">🎵 SoundWarp</h1>
        <p className="text-gray-400 text-center text-sm">
          Gissa låten! Du hör den warpad — varje fel gissning gör den tydligare.
        </p>
        <p className="text-xs text-gray-600">
          Spelade: {getPlayedCount()} / {getTotalTrackCount()} låtar
          {getPlayedCount() > 0 && (
            <button onClick={() => { resetHistory(); setActiveCategory(null); setSelectedTrack(null) }} className="ml-2 text-indigo-500 hover:text-indigo-400">
              Nollställ historik
            </button>
          )}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.emoji} {cat.label}
              <span className="ml-1 text-[10px] opacity-60">
                {getRemainingCount(cat.key)}/{cat.tracks.length}
              </span>
            </button>
          ))}
        </div>

        {/* Category selected — ready to play */}
        {activeCategory && (
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-3 rounded-lg w-full">
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-lg">
              {CATEGORIES.find(c => c.key === activeCategory)?.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">🎵 Slumpad låt redo!</p>
              <p className="text-xs text-gray-400">{CATEGORIES.find(c => c.key === activeCategory)?.label} — {getRemainingCount(activeCategory)} kvar</p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-600 text-xs w-full">
          <div className="flex-1 border-t border-gray-700" />
          eller sök
          <div className="flex-1 border-t border-gray-700" />
        </div>

        {/* Search */}
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Sök låt eller artist..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
          >
            {searching ? '...' : 'Sök'}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto w-full">
            {searchResults.map(track => (
              <button
                key={track.id}
                onClick={() => handleSelectSearchResult(track)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-left bg-gray-800 hover:bg-gray-700"
              >
                <img src={track.cover} alt="" className="w-10 h-10 rounded" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${track.source === 'deezer' ? 'bg-purple-900 text-purple-300' : 'bg-pink-900 text-pink-300'}`}>
                  {track.source === 'deezer' ? 'Deezer' : 'iTunes'}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Start button */}
        <button
          onClick={() => startGame()}
          disabled={!selectedTrack && !activeCategory}
          className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-colors"
        >
          🎮 Starta spelet!
        </button>
      </div>
    )
  }

  // LOADING
  if (gameState === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h1 className="text-2xl font-bold">🎵 SoundWarp</h1>
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">
          {processingState === 'fetching' ? 'Hämtar låt...' : 'Warpar ljud...'}
        </p>
        {error && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={handleBackToMenu} className="px-4 py-2 bg-gray-700 rounded-lg text-sm">
              Tillbaka
            </button>
          </div>
        )}
      </div>
    )
  }

  // PLAYING
  if (gameState === 'playing') {
    return (
      <div className="flex flex-col items-center gap-4 p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">🎵 SoundWarp</h1>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Gissning {currentGuessNum + 1} av {MAX_GUESSES}</span>
            <span>{LEVEL_LABELS[currentLevel]}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${((currentGuessNum) / MAX_GUESSES) * 100}%` }}
            />
          </div>
        </div>

        {/* Previous guesses */}
        {guesses.length > 0 && (
          <div className="w-full flex flex-col gap-1">
            {guesses.map((g, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded text-sm">
                <span className="text-red-400">✗</span>
                <span className="text-gray-400">{g}</span>
              </div>
            ))}
          </div>
        )}

        {/* Playback controls */}
        <div className="flex gap-3">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-semibold transition-colors"
          >
            ▶ Spela
          </button>
          <button
            onClick={handlePause}
            disabled={!isPlaying}
            className="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 rounded-lg font-semibold transition-colors"
          >
            ⏸ Pausa
          </button>
          <button
            onClick={handleReplay}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-colors"
          >
            ↺ Igen
          </button>
        </div>

        {/* Multiple choice — 2 columns */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {choices.map((choice, i) => {
            const wasGuessed = guesses.includes(`${choice.title} — ${choice.artist}`)
            return (
              <button
                key={choice.id + '-' + i}
                onClick={() => !wasGuessed && handleChoiceClick(choice)}
                disabled={wasGuessed}
                className={`px-3 py-2.5 rounded-lg text-left transition-colors ${
                  wasGuessed
                    ? 'bg-red-900/30 text-red-400/50 cursor-not-allowed line-through'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <p className="font-medium text-sm truncate">{choice.title}</p>
                <p className="text-gray-400 text-xs truncate">{choice.artist}</p>
              </button>
            )
          })}
        </div>

        {/* Skip */}
        <button
          onClick={handleSkip}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Vet inte — skippa →
        </button>

        {/* Source badge */}
        {audioSource && (
          <p className="text-[10px] text-gray-600">
            via {audioSource === 'deezer' ? 'Deezer' : 'iTunes'}
          </p>
        )}
      </div>
    )
  }

  // WON
  if (gameState === 'won') {
    const score = MAX_GUESSES - currentGuessNum
    const stars = '⭐'.repeat(score)
    return (
      <div className="flex flex-col items-center gap-4 p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">🎉 Rätt!</h1>
        <div className="text-center">
          <p className="text-xl font-semibold">{selectedTrack?.title}</p>
          <p className="text-gray-400">{selectedTrack?.artist}</p>
        </div>
        <p className="text-2xl">{stars}</p>
        <p className="text-gray-400">Du gissade rätt på {currentGuessNum + 1} av {MAX_GUESSES} försök!</p>

        {/* Guesses recap */}
        <div className="w-full flex flex-col gap-1">
          {guesses.map((g, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded text-sm">
              <span className={i === guesses.length - 1 ? 'text-green-400' : 'text-red-400'}>
                {i === guesses.length - 1 ? '✓' : '✗'}
              </span>
              <span className={i === guesses.length - 1 ? 'text-green-300' : 'text-gray-400'}>{g}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleNextRound}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors"
          >
            🎲 Nästa låt
          </button>
          <button
            onClick={handleBackToMenu}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            ← Meny
          </button>
        </div>
      </div>
    )
  }

  // LOST
  if (gameState === 'lost') {
    return (
      <div className="flex flex-col items-center gap-4 p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">😢 Fel!</h1>
        <p className="text-gray-400">Rätt svar var:</p>
        <div className="text-center">
          <p className="text-xl font-semibold text-indigo-400">{selectedTrack?.title}</p>
          <p className="text-gray-400">{selectedTrack?.artist}</p>
        </div>

        {/* Guesses recap */}
        <div className="w-full flex flex-col gap-1">
          {guesses.map((g, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded text-sm">
              <span className="text-red-400">✗</span>
              <span className="text-gray-400">{g}</span>
            </div>
          ))}
        </div>

        {/* Play clean version */}
        <button
          onClick={async () => {
            const buf = cacheRef.current?.getBuffer(0)
            if (buf) { await ensureAudioContextRunning(); playBuffer(buf) }
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
        >
          🎵 Lyssna på orginalet
        </button>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleNextRound}
            className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors"
          >
            🎲 Nästa låt
          </button>
          <button
            onClick={handleBackToMenu}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            ← Meny
          </button>
        </div>
      </div>
    )
  }

  return null
}
