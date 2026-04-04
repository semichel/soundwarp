import { useRef, useCallback, useState } from 'react'
import { useAudioStore } from '../store/audioStore'
import { useTeamStore, TEAM_COLORS, type Team } from '../store/teamStore'
import {
  ensureAudioContextRunning,
  playBuffer,
  pausePlayback,
  stopPlayback,
} from '../audio/AudioEngine'
import { preRenderAllLevels } from '../audio/AudioProcessor'
import type { EffectCache } from '../audio/effectCache'
import type { RevealLevel } from '../audio/types'
import { CATEGORIES, getRandomTrack, markAsPlayed, getRemainingCount, type TrackEntry } from '../data/trackDb'
import { getPreviewUrl, fetchPreviewAudio } from '../audio/MusicService'

const LEVEL_LABELS: Record<number, string> = {
  4: '🤯 Nivå 5 — Allt på',
  3: '🔄 Nivå 4 — Baklänges',
  2: '🐌 Nivå 3 — Låg pitch + långsam',
  1: '⚡ Nivå 2 — Hög pitch + snabb',
  0: '🎵 Nivå 1 — Normalt',
}

const MAX_GUESSES = 5

type Phase = 'setup' | 'category' | 'loading' | 'playing' | 'result' | 'scoreboard' | 'gameover'

export function TeamGame({ onBack }: { onBack: () => void }) {
  const { isPlaying, setPlaying, setProcessingState, setError } = useAudioStore()
  const { teams, currentTeamIndex, currentRound, roundsPerTeam, gameOver, setTeams, setRoundsPerTeam, addScore, nextTurn, resetGame } = useTeamStore()
  const cacheRef = useRef<EffectCache | null>(null)

  const [phase, setPhase] = useState<Phase>('setup')
  const [teamNames, setTeamNames] = useState(['Lag 1', 'Lag 2'])
  const [numTeams, setNumTeams] = useState(2)
  const [rounds, setRounds] = useState(3)
  const [, setActiveCategory] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<TrackEntry | null>(null)
  const [currentGuessNum, setCurrentGuessNum] = useState(0)
  const [guesses, setGuesses] = useState<string[]>([])
  const [choices, setChoices] = useState<TrackEntry[]>([])
  const [loadingStep, setLoadingStep] = useState('')
  const [roundScore, setRoundScore] = useState(0)

  // Category draft — 3 random categories, both teams pick from same pool
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [usedCategoryKeys, setUsedCategoryKeys] = useState<Set<string>>(new Set())

  const currentLevel = (4 - currentGuessNum) as RevealLevel
  const currentTeam = teams[currentTeamIndex]

  const generateChoices = useCallback((correctTrack: TrackEntry, categoryKey: string | null): TrackEntry[] => {
    const allTracks = CATEGORIES.flatMap(c => c.tracks)
    const sameCat = categoryKey ? (CATEGORIES.find(c => c.key === categoryKey)?.tracks ?? []) : []
    const pool = sameCat.length >= 10 ? sameCat : allTracks
    const wrongAnswers = pool.filter(t => t.id !== correctTrack.id && t.title !== correctTrack.title)
    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5).slice(0, 9)
    return [...shuffled, correctTrack].sort(() => Math.random() - 0.5)
  }, [])

  const drawNewCategories = useCallback(() => {
    // Get categories that haven't been fully used yet
    const available = CATEGORIES
      .map(c => c.key)
      .filter(key => !usedCategoryKeys.has(key) && getRemainingCount(key) > 0)

    // If we've used all categories, reset
    if (available.length < 3) {
      setUsedCategoryKeys(new Set())
      const all = CATEGORIES.filter(c => getRemainingCount(c.key) > 0).map(c => c.key)
      const shuffled = all.sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 3)
    }

    const shuffled = available.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }, [usedCategoryKeys])

  // === SETUP ===
  const handleStartGame = useCallback(() => {
    const newTeams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      name: teamNames[i] || `Lag ${i + 1}`,
      color: TEAM_COLORS[i].bg,
      score: 0,
    }))
    setTeams(newTeams)
    setRoundsPerTeam(rounds)
    setUsedCategoryKeys(new Set())
    setAvailableCategories(drawNewCategories())
    setPhase('category')
  }, [numTeams, teamNames, rounds, setTeams, setRoundsPerTeam, drawNewCategories])

  // === LOAD TRACK ===
  const loadTrack = useCallback(async (categoryKey: string) => {
    setActiveCategory(categoryKey)

    // Remove chosen category from available pool
    setAvailableCategories(prev => {
      const remaining = prev.filter(k => k !== categoryKey)
      // If pool is empty, draw 3 new ones
      if (remaining.length === 0) {
        const newUsed = new Set(usedCategoryKeys)
        newUsed.add(categoryKey)
        setUsedCategoryKeys(newUsed)
        // Draw new categories (will happen on next render via drawNewCategories)
        const available = CATEGORIES
          .map(c => c.key)
          .filter(key => !newUsed.has(key) && getRemainingCount(key) > 0)
        if (available.length < 3) {
          // Reset if running low
          setUsedCategoryKeys(new Set())
          const all = CATEGORIES.filter(c => getRemainingCount(c.key) > 0).map(c => c.key)
          return all.sort(() => Math.random() - 0.5).slice(0, 3)
        }
        return available.sort(() => Math.random() - 0.5).slice(0, 3)
      }
      return remaining
    })

    const track = getRandomTrack(categoryKey)
    if (!track) return

    setSelectedTrack(track)
    setCurrentGuessNum(0)
    setGuesses([])
    setChoices(generateChoices(track, categoryKey))
    setPhase('loading')
    setRoundScore(0)

    try {
      setLoadingStep('Startar ljud...')
      const ctx = await ensureAudioContextRunning()
      setProcessingState('fetching')
      setError(null)

      setLoadingStep('Söker låt...')
      const result = await getPreviewUrl(track.id, track.title, track.artist)
      setLoadingStep(`Hämtar ljud via ${result.source}...`)

      const arrayBuffer = await fetchPreviewAudio(result.url)
      setLoadingStep('Dekodrar ljud...')
      const sourceBuffer = await ctx.decodeAudioData(arrayBuffer)

      setProcessingState('processing')
      setLoadingStep('Warpar ljud (5 nivåer)...')
      const cache = await preRenderAllLevels(sourceBuffer)
      cacheRef.current = cache

      setProcessingState('ready')
      setPhase('playing')
      markAsPlayed(track.id)

      const buffer = cache.getBuffer(4)
      if (buffer) {
        await ensureAudioContextRunning()
        playBuffer(buffer)
        setPlaying(true)
      }
    } catch (err) {
      setProcessingState('error')
      setError(err instanceof Error ? err.message : 'Failed to load')
      setPhase('category')
    }
  }, [generateChoices, setProcessingState, setError, setPlaying])

  // === PLAY/PAUSE ===
  const handlePlay = useCallback(async () => {
    const buffer = cacheRef.current?.getBuffer(currentLevel)
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
    const buffer = cacheRef.current?.getBuffer(currentLevel)
    if (!buffer) return
    stopPlayback()
    await ensureAudioContextRunning()
    playBuffer(buffer)
    setPlaying(true)
  }, [currentLevel, setPlaying])

  // === GUESS ===
  const handleChoiceClick = useCallback((choice: TrackEntry) => {
    if (!selectedTrack) return
    const correct = choice.id === selectedTrack.id || choice.title === selectedTrack.title
    const label = `${choice.title} — ${choice.artist}`
    setGuesses(prev => [...prev, label])

    if (correct) {
      const points = MAX_GUESSES - currentGuessNum
      setRoundScore(points)
      addScore(currentTeamIndex, points)
      stopPlayback()
      setPlaying(false)
      setPhase('result')
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
      setRoundScore(0)
      stopPlayback()
      setPlaying(false)
      setPhase('result')
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
  }, [selectedTrack, currentGuessNum, currentTeamIndex, addScore, setPlaying])

  const handleSkip = useCallback(() => {
    setGuesses(prev => [...prev, '⏭ Skippade'])
    const nextGuessNum = currentGuessNum + 1
    if (nextGuessNum >= MAX_GUESSES) {
      setRoundScore(0)
      stopPlayback()
      setPlaying(false)
      setPhase('result')
      return
    }
    setCurrentGuessNum(nextGuessNum)
    const nextLevel = (4 - nextGuessNum) as RevealLevel
    const buffer = cacheRef.current?.getBuffer(nextLevel)
    if (buffer) {
      stopPlayback()
      ensureAudioContextRunning().then(() => { playBuffer(buffer); setPlaying(true) })
    }
  }, [currentGuessNum, setPlaying])

  // === NEXT TURN ===
  const handleNextTurn = useCallback(() => {
    stopPlayback()
    setPlaying(false)
    cacheRef.current = null
    nextTurn()
    if (gameOver || (currentTeamIndex + 1 >= teams.length && currentRound >= roundsPerTeam)) {
      setPhase('gameover')
    } else {
      setPhase('scoreboard')
    }
  }, [nextTurn, gameOver, currentTeamIndex, teams.length, currentRound, roundsPerTeam, setPlaying])

  const handleContinueFromScoreboard = useCallback(() => {
    setPhase('category')
  }, [])

  // ============ RENDER ============

  // SETUP
  if (phase === 'setup') {
    return (
      <div className="flex flex-col items-center gap-5 p-6 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">🎵 SoundWarp</h1>
        <h2 className="text-xl text-indigo-400">Lagspel</h2>

        <div className="w-full">
          <label className="text-sm text-gray-400">Antal lag</label>
          <div className="flex gap-2 mt-1">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setNumTeams(n)
                  setTeamNames(prev => {
                    const names = [...prev]
                    while (names.length < n) names.push(`Lag ${names.length + 1}`)
                    return names.slice(0, n)
                  })
                }}
                className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                  numTeams === n ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {n} lag
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-sm text-gray-400">Lagnamn</label>
          {Array.from({ length: numTeams }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${TEAM_COLORS[i].bg}`} />
              <input
                type="text"
                value={teamNames[i] || ''}
                onChange={e => {
                  const names = [...teamNames]
                  names[i] = e.target.value
                  setTeamNames(names)
                }}
                placeholder={`Lag ${i + 1}`}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        <div className="w-full">
          <label className="text-sm text-gray-400">Antal rundor per lag</label>
          <div className="flex gap-2 mt-1">
            {[3, 5, 7, 10].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRounds(n)}
                className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                  rounds === n ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartGame}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg transition-colors"
        >
          🎮 Starta lagspel!
        </button>

        <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-300">
          ← Tillbaka
        </button>
      </div>
    )
  }

  // CATEGORY SELECT
  if (phase === 'category') {
    return (
      <div className="flex flex-col items-center gap-4 p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">🎵 SoundWarp</h1>

        {/* Current team indicator */}
        <div className={`w-full py-3 px-4 rounded-lg text-center font-bold text-lg ${TEAM_COLORS[currentTeamIndex].bg}`}>
          {currentTeam?.name} spelar! (Runda {currentRound}/{roundsPerTeam})
        </div>

        {/* Scoreboard mini */}
        <div className="flex gap-3 w-full">
          {teams.map((team, i) => (
            <div key={i} className={`flex-1 text-center py-2 rounded-lg ${
              i === currentTeamIndex ? TEAM_COLORS[i].bg : 'bg-gray-800'
            }`}>
              <p className="text-xs">{team.name}</p>
              <p className="text-xl font-bold">{team.score}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-sm">Välj en kategori:</p>

        <div className="flex flex-col gap-3 w-full">
          {availableCategories.map(key => {
            const cat = CATEGORIES.find(c => c.key === key)
            if (!cat) return null
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => loadTrack(cat.key)}
                className="w-full py-4 rounded-xl text-lg font-bold bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {cat.emoji} {cat.label}
                <span className="ml-2 text-sm font-normal text-gray-400">{getRemainingCount(cat.key)} låtar kvar</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // LOADING
  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <h1 className="text-2xl font-bold">🎵 SoundWarp</h1>
        <div className={`py-2 px-4 rounded-lg font-bold ${TEAM_COLORS[currentTeamIndex].bg}`}>
          {currentTeam?.name}
        </div>
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">{loadingStep}</p>
      </div>
    )
  }

  // PLAYING
  if (phase === 'playing') {
    return (
      <div className="flex flex-col items-center gap-4 p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">🎵 SoundWarp</h1>

        {/* Team + progress */}
        <div className="w-full flex items-center justify-between">
          <div className={`py-1 px-3 rounded-lg font-bold text-sm ${TEAM_COLORS[currentTeamIndex].bg}`}>
            {currentTeam?.name}
          </div>
          <span className="text-xs text-gray-500">{LEVEL_LABELS[currentLevel]}</span>
        </div>

        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Gissning {currentGuessNum + 1} av {MAX_GUESSES}</span>
            <span>Runda {currentRound}/{roundsPerTeam}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(currentGuessNum / MAX_GUESSES) * 100}%` }} />
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

        {/* Controls */}
        <div className="flex gap-3">
          <button type="button" onClick={handlePlay} disabled={isPlaying}
            className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-semibold transition-colors">
            ▶ Spela
          </button>
          <button type="button" onClick={handlePause} disabled={!isPlaying}
            className="px-5 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 rounded-lg font-semibold transition-colors">
            ⏸ Pausa
          </button>
          <button type="button" onClick={handleReplay}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-semibold transition-colors">
            ↺ Igen
          </button>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {choices.map((choice, i) => {
            const wasGuessed = guesses.includes(`${choice.title} — ${choice.artist}`)
            return (
              <button
                key={choice.id + '-' + i}
                type="button"
                onClick={() => !wasGuessed && handleChoiceClick(choice)}
                disabled={wasGuessed}
                className={`px-3 py-2.5 rounded-lg text-left transition-colors ${
                  wasGuessed ? 'bg-red-900/30 text-red-400/50 cursor-not-allowed line-through'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                <p className="font-medium text-sm truncate">{choice.title}</p>
                <p className="text-gray-400 text-xs truncate">{choice.artist}</p>
              </button>
            )
          })}
        </div>

        <button type="button" onClick={handleSkip} className="text-sm text-gray-500 hover:text-gray-300">
          Vet inte — skippa →
        </button>
      </div>
    )
  }

  // RESULT
  if (phase === 'result') {
    const correct = roundScore > 0
    return (
      <div className="flex flex-col items-center gap-4 p-8 max-w-lg mx-auto">
        <div className={`py-2 px-4 rounded-lg font-bold ${TEAM_COLORS[currentTeamIndex].bg}`}>
          {currentTeam?.name}
        </div>

        <h1 className="text-3xl font-bold">{correct ? '🎉 Rätt!' : '😢 Fel!'}</h1>

        <div className="text-center">
          <p className="text-xl font-semibold">{selectedTrack?.title}</p>
          <p className="text-gray-400">{selectedTrack?.artist}</p>
        </div>

        {correct && <p className="text-2xl">{'⭐'.repeat(roundScore)}</p>}
        <p className="text-gray-400">
          {correct
            ? `+${roundScore} poäng! (gissning ${currentGuessNum + 1} av ${MAX_GUESSES})`
            : '0 poäng den här rundan'}
        </p>

        {/* Guesses recap */}
        <div className="w-full flex flex-col gap-1">
          {guesses.map((g, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded text-sm">
              <span className={i === guesses.length - 1 && correct ? 'text-green-400' : 'text-red-400'}>
                {i === guesses.length - 1 && correct ? '✓' : '✗'}
              </span>
              <span className={i === guesses.length - 1 && correct ? 'text-green-300' : 'text-gray-400'}>{g}</span>
            </div>
          ))}
        </div>

        {!correct && (
          <button type="button" onClick={async () => {
            const buf = cacheRef.current?.getBuffer(0)
            if (buf) { await ensureAudioContextRunning(); playBuffer(buf) }
          }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm">
            🎵 Lyssna på originalet
          </button>
        )}

        <button type="button" onClick={handleNextTurn}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg transition-colors">
          Nästa tur →
        </button>
      </div>
    )
  }

  // SCOREBOARD (between turns)
  if (phase === 'scoreboard') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    return (
      <div className="flex flex-col items-center gap-5 p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">📊 Ställning</h1>
        <p className="text-gray-400">Runda {currentRound} av {roundsPerTeam}</p>

        <div className="w-full flex flex-col gap-3">
          {sorted.map((team, i) => {
            const teamIdx = teams.indexOf(team)
            const isNext = teamIdx === currentTeamIndex
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isNext ? TEAM_COLORS[teamIdx].bg : 'bg-gray-800'
              }`}>
                <span className="text-2xl font-bold">{i === 0 ? '👑' : `#${i + 1}`}</span>
                <div className="flex-1">
                  <p className="font-bold">{team.name}</p>
                  {isNext && <p className="text-xs opacity-80">Spelar näst!</p>}
                </div>
                <p className="text-2xl font-bold">{team.score}p</p>
              </div>
            )
          })}
        </div>

        <button type="button" onClick={handleContinueFromScoreboard}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg transition-colors">
          {currentTeam?.name} väljer kategori →
        </button>
      </div>
    )
  }

  // GAME OVER
  if (phase === 'gameover') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    const winner = sorted[0]
    const winnerIdx = teams.indexOf(winner)
    return (
      <div className="flex flex-col items-center gap-5 p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">🏆 Spelet slut!</h1>
        <div className={`py-3 px-6 rounded-xl font-bold text-xl ${TEAM_COLORS[winnerIdx].bg}`}>
          {winner.name} vinner med {winner.score}p!
        </div>

        <div className="w-full flex flex-col gap-3">
          {sorted.map((team, i) => {
            const teamIdx = teams.indexOf(team)
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                i === 0 ? TEAM_COLORS[teamIdx].bg : 'bg-gray-800'
              }`}>
                <span className="text-2xl font-bold">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <p className="flex-1 font-bold">{team.name}</p>
                <p className="text-2xl font-bold">{team.score}p</p>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 w-full">
          <button type="button" onClick={() => { resetGame(); setPhase('setup') }}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors">
            🔄 Spela igen
          </button>
          <button type="button" onClick={() => { resetGame(); onBack() }}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors">
            ← Meny
          </button>
        </div>
      </div>
    )
  }

  return null
}
