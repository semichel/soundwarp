import { useState, Component, type ReactNode, type ErrorInfo } from 'react'
import { AudioPlayer } from './components/AudioPlayer'
import { TestPage } from './pages/TestPage'

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

export default function App() {
  const [showTest, setShowTest] = useState(false)

  if (showTest) {
    return (
      <ErrorBoundary>
        <button
          onClick={() => setShowTest(false)}
          style={{ position: 'fixed', top: 10, right: 10, zIndex: 99, padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          ← Back to App
        </button>
        <TestPage />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <AudioPlayer />
        <button
          onClick={() => setShowTest(true)}
          className="mt-8 text-xs text-gray-600 hover:text-gray-400"
        >
          Debug: Audio Test
        </button>
      </div>
    </ErrorBoundary>
  )
}
