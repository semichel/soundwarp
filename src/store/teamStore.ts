import { create } from 'zustand'

export interface Team {
  name: string
  color: string
  score: number
}

interface TeamState {
  teams: Team[]
  currentTeamIndex: number
  maxScore: number
  currentRound: number
  gameOver: boolean
  winner: string | null

  setTeams: (teams: Team[]) => void
  setMaxScore: (n: number) => void
  addScore: (teamIndex: number, points: number) => void
  nextTurn: () => void
  resetGame: () => void
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeamIndex: 0,
  maxScore: 15,
  currentRound: 1,
  gameOver: false,
  winner: null,

  setTeams: (teams) => set({ teams, currentTeamIndex: 0, currentRound: 1, gameOver: false, winner: null }),

  setMaxScore: (n) => set({ maxScore: n }),

  addScore: (teamIndex, points) => {
    const { teams, maxScore } = get()
    const updated = teams.map((t, i) =>
      i === teamIndex ? { ...t, score: t.score + points } : t
    )
    // Check if any team reached max score
    const winningTeam = updated.find(t => t.score >= maxScore)
    if (winningTeam) {
      set({ teams: updated, gameOver: true, winner: winningTeam.name })
    } else {
      set({ teams: updated })
    }
  },

  nextTurn: () => {
    const { teams, currentTeamIndex, currentRound, gameOver } = get()
    if (gameOver) return
    const nextIndex = currentTeamIndex + 1
    if (nextIndex >= teams.length) {
      set({ currentTeamIndex: 0, currentRound: currentRound + 1 })
    } else {
      set({ currentTeamIndex: nextIndex })
    }
  },

  resetGame: () => set({
    teams: [],
    currentTeamIndex: 0,
    currentRound: 1,
    gameOver: false,
    winner: null,
  }),
}))

export const TEAM_COLORS = [
  { name: 'Blå', bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500' },
  { name: 'Röd', bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-500' },
  { name: 'Grön', bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-500' },
  { name: 'Gul', bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-500' },
]
