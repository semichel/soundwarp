import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import http from 'node:http'
import https from 'node:https'

export default defineConfig({
  base: '/soundwarp/',
  plugins: [
    react(),
    tailwindcss(),
    // Custom plugin for audio preview proxy — handles any URL (Deezer, iTunes, etc.)
    {
      name: 'audio-preview-proxy',
      configureServer(server) {
        server.middlewares.use('/api/preview', (req, res) => {
          const url = new URL(req.url!, 'http://localhost')
          const audioUrl = url.searchParams.get('url')
          if (!audioUrl) {
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('Missing url parameter')
            return
          }

          const parsed = new URL(audioUrl)
          const client = parsed.protocol === 'https:' ? https : http

          const proxyReq = client.get(audioUrl, {
            headers: { 'User-Agent': 'SoundWarp/1.0' },
          }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode ?? 500, {
              'Content-Type': proxyRes.headers['content-type'] ?? 'audio/mpeg',
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=86400',
            })
            proxyRes.pipe(res)
          })

          proxyReq.on('error', (err) => {
            console.error('[preview-proxy] Error:', err.message)
            res.writeHead(502, { 'Content-Type': 'text/plain' })
            res.end('Proxy error: ' + err.message)
          })
        })
      },
    },
  ],
  server: {
    proxy: {
      '/api/deezer': {
        target: 'https://api.deezer.com',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/deezer', ''),
      },
      '/api/itunes': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/itunes', ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup/web-audio-mock.ts'],
  },
})
