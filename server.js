import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = process.env.PORT || 3000

// Railway terminates TLS at the edge; trust its proxy headers so req.protocol
// and req.secure are honest.
app.set('trust proxy', true)

/* ------------------------------------------------------------------ *
 * Canonical host redirect
 *
 * Both robotunderyourbed.com and .co.nz point here. Once you've decided
 * which one is canonical, set CANONICAL_HOST in Railway (e.g.
 * "robotunderyourbed.com") and the other will 301 to it. Left unset,
 * both serve the same page — which is fine, just not ideal for SEO.
 * ------------------------------------------------------------------ */
const CANONICAL_HOST = process.env.CANONICAL_HOST

app.use((req, res, next) => {
  if (!CANONICAL_HOST) return next()
  const host = req.hostname
  if (host === CANONICAL_HOST || host === 'localhost' || host.endsWith('.railway.app')) return next()
  return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`)
})

app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff')
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

/* ------------------------------------------------------------------ *
 * Static
 * Assets are content-addressed enough to cache hard; the HTML is not.
 * ------------------------------------------------------------------ */
app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
  maxAge: '30d',
  immutable: false,
}))

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  etag: true,
}))

/* ------------------------------------------------------------------ *
 * Health check — Railway pings this.
 * ------------------------------------------------------------------ */
app.get('/healthz', (req, res) => res.type('text').send('ok'))

/* ------------------------------------------------------------------ *
 * The robot. Not built yet.
 *
 * This is where the router will live: take the visitor's message, ask
 * Claude which of Michael's lines comes next, return that line's id.
 * The model NEVER generates prose — it picks. All copy stays in a table
 * on the server.
 *
 * Needs ANTHROPIC_API_KEY in the Railway environment. The key must stay
 * server-side; this route is why the site is a Node app and not a static
 * bucket.
 * ------------------------------------------------------------------ */
app.post('/api/chat', express.json({ limit: '4kb' }), (req, res) => {
  res.status(501).json({ error: 'not_built_yet' })
})

// One page. Anything else comes back to it.
app.use((req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`robotunderyourbed listening on ${PORT}`)
})
