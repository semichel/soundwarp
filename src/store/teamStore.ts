import { create } from 'zustand'

export interface Team {
  name: string
  color: string
  score: number
}

interface TeamState {
  teams: Team[]
  currentTeamIndex: number
  roundsPerTeam: number
  currentRound: number
  totalRounds: number
  gameOver: boolean

  setTeams: (teams: Team[]) => void
  setRoundsPerTeam: (n: number) => void
  addScore: (teamIndex: number, points: number) => void
  nextTurn: () => void
  resetGame: () => void
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeamIndex: 0,
  roundsPerTeam: 3,
  currentRound: 1,
  totalRounds: 0,
  gameOver: false,

  setTeams: (teams) => set({ teams, currentTeamIndex: 0, currentRound: 1, gameOver: false }),

  setRoundsPerTeam: (n) => set({ roundsPerTeam: n }),

  addScore: (teamIndex, points) => set((state) => ({
    teams: state.teams.map((t, i) =>
      i === teamIndex ? { ...t, score: t.score + points } : t
    ),
  })),

  nextTurn: () => {
    const { teams, currentTeamIndex, currentRound, roundsPerTeam } = get()
    const nextIndex = currentTeamIndex + 1

    if (nextIndex >= teams.length) {
      // All teams played this round
      if (currentRound >= roundsPerTeam) {
        set({ gameOver: true })
      } else {
        set({ currentTeamIndex: 0, currentRound: currentRound + 1 })
      }
    } else {
      set({ currentTeamIndex: nextIndex })
    }
  },

  resetGame: () => set({
    teams: [],
    currentTeamIndex: 0,
    currentRound: 1,
    gameOver: false,
  }),
}))

export const TEAM_COLORS = [
  { name: 'Blå', bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500' },
  { name: 'Röd', bg: 'bg-red-600', text: 'text-red-400', border: 'border-red-500' },
  { name: 'Grön', bg: 'bg-green-600', text: 'text-green-400', border: 'border-green-500' },
  { name: 'Gul', bg: 'bg-yellow-600', text: 'text-yellow-400', border: 'border-yellow-500' },
]
