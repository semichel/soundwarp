import { useState } from 'react'
import * as Tone from 'tone'
import { ensureAudioContextRunning, playBuffer } from '../audio/AudioEngine'
import { fetchAndDecodePreview } from '../audio/AudioFetcher'

const PROXY_BASE = ''

export function TestPage() {
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  function l(msg: string) {
    setLog(prev => [...prev, msg])
    console.log(msg)
  }

  async function runTest() {
    setLog([])
    setRunning(true)
    try {
      l('1. Creating AudioContext...')
      const ctx = await ensureAudioContextRunning()
      l(`   OK: state=${ctx.state}, sampleRate=${ctx.sampleRate}`)

      l('2. Fetching track metadata (Cher - Believe, ID 786717)...')
      const metaRes = await fetch(`${PROXY_BASE}/api/deezer/track/786717`)
      l(`   HTTP ${metaRes.status}`)
      if (!metaRes.ok) { l('FAIL: metadata fetch'); return }
      const meta = await metaRes.json()
      l(`   Title: ${meta.title} - ${meta.artist?.name}`)
      l(`   Preview: ${meta.preview ? 'YES' : 'NO - FAIL'}`)
      if (!meta.preview) return

      l('3. Fetching audio via proxy...')
      const sourceBuffer = await fetchAndDecodePreview(PROXY_BASE, meta.preview, ctx)
      l(`   OK: ${sourceBuffer.duration.toFixed(1)}s, ${sourceBuffer.numberOfChannels}ch`)

      l('4. Tone.Offline — clean render (no effects)...')
      const t0 = Date.now()
      const clean = await Tone.Offline(({ transport }) => {
        const player = new Tone.Player(sourceBuffer)
        player.toDestination()
        transport.start()
        player.start(0)
      }, sourceBuffer.duration)
      l(`   OK: ${(Date.now() - t0)}ms`)

      l('5. Tone.Offline — with PitchShift...')
      const t1 = Date.now()
      await Tone.Offline(({ transport }) => {
        const player = new Tone.Player(sourceBuffer)
        const ps = new Tone.PitchShift(5)
        ps.toDestination()
        player.connect(ps)
        transport.start()
        player.start(0)
      }, sourceBuffer.duration)
      l(`   OK: ${(Date.now() - t1)}ms`)

      l('6. Tone.Offline — with Reverb (async ready)...')
      const t2 = Date.now()
      try {
        await Tone.Offline(async ({ transport }) => {
          const player = new Tone.Player(sourceBuffer)
          const reverb = new Tone.Reverb({ decay: 0.8, wet: 0.5 })
          await reverb.ready
          reverb.toDestination()
          player.connect(reverb)
          transport.start()
          player.start(0)
        }, sourceBuffer.duration)
        l(`   OK: ${(Date.now() - t2)}ms`)
      } catch (e) {
        l(`   FAIL: ${e instanceof Error ? e.message : e}`)
        l('   Trying without reverb.ready...')
        const t3 = Date.now()
        try {
          await Tone.Offline(({ transport }) => {
            const player = new Tone.Player(sourceBuffer)
            const reverb = new Tone.Reverb({ decay: 0.8, wet: 0.5 })
            reverb.toDestination()
            player.connect(reverb)
            transport.start()
            player.start(0)
          }, sourceBuffer.duration)
          l(`   OK without await: ${(Date.now() - t3)}ms`)
        } catch (e2) {
          l(`   ALSO FAIL: ${e2 instanceof Error ? e2.message : e2}`)
        }
      }

      l('7. Playing clean buffer...')
      const buf = clean.get()
      if (buf) {
        playBuffer(buf)
        l('   Playing!')
      } else {
        l('   FAIL: clean.get() returned null')
      }

      l('')
      l('=== ALL TESTS DONE ===')
    } catch (e) {
      l(`\nERROR: ${e instanceof Error ? e.message : e}`)
      if (e instanceof Error) l(`Stack: ${e.stack}`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div style={{ background: '#111', color: '#eee', fontFamily: 'monospace', padding: 20, minHeight: '100vh' }}>
      <h2>SoundWarp Audio Debug</h2>
      <button
        onClick={runTest}
        disabled={running}
        style={{ padding: '12px 24px', fontSize: 16, cursor: 'pointer' }}
      >
        {running ? 'Running...' : 'Run Test'}
      </button>
      <pre style={{ marginTop: 20, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
        {log.join('\n')}
      </pre>
    </div>
  )
}
