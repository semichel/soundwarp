import { useState, Component, type ReactNode, type ErrorInfo } from 'react'
import { AudioPlayer } from './components/AudioPlayer'
import { TeamGame } from './components/TeamGame'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }
  static getDerivedStateFromError(error: Error) {
    return { error: error.message }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[SoundWarp] Crash:', error, info.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#111', color: '#eee', padding: 40, fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2 style={{ color: '#f87171' }}>SoundWarp kraschade</h2>
          <pre style={{ color: '#fbbf24', marginTop: 16 }}>{this.state.error}</pre>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload() }}
            style={{ marginTop: 20, padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Ladda om
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

type Mode = 'start' | 'solo' | 'team'

export default function App() {
  const [mode, setMode] = useState<Mode>('start')

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-white">
        {mode === 'start' && (
          <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
            <h1 className="text-4xl font-bold">🎵 SoundWarp</h1>
            <p className="text-[10px] text-gray-600">v0.4.0</p>
            <p className="text-gray-400 text-center max-w-md">
              Gissa låten! Musiken är warpad med effekter — varje fel gissning avslöjar mer.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button
                type="button"
                onClick={() => setMode('solo')}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-lg transition-colors"
              >
                🎧 Solo
                <p className="text-sm font-normal opacity-70 mt-1">Spela själv</p>
              </button>

              <button
                type="button"
                onClick={() => setMode('team')}
                className="w-full py-5 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg transition-colors"
              >
                👥 Lagspel
                <p className="text-sm font-normal opacity-70 mt-1">2-4 lag, turas om</p>
              </button>
            </div>
          </div>
        )}

        {mode === 'solo' && (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <AudioPlayer />
            <button
              type="button"
              onClick={() => setMode('start')}
              className="mt-8 text-xs text-gray-600 hover:text-gray-400"
            >
              ← Tillbaka till start
            </button>
          </div>
        )}

        {mode === 'team' && (
          <div className="flex items-center justify-center min-h-screen">
            <TeamGame onBack={() => setMode('start')} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
