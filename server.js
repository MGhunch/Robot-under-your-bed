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

/* ------------------------------------------------------------------ *
 * Get the book — the enquiry form.
 *
 * Sends name, email and message to Michael through Resend. The visitor's
 * address goes in reply-to, so hitting Reply answers them.
 *
 * Railway variables:
 *   RESEND_API_KEY   required — without it the form shows its error line
 *   ENQUIRY_TO       optional, default michael@hunch.co.nz
 *   ENQUIRY_FROM     optional, default "Robot Under Your Bed <hello@robotunderyourbed.com>"
 *                    (the domain must be verified in Resend)
 * ------------------------------------------------------------------ */
const ENQUIRY_TO   = process.env.ENQUIRY_TO   || 'michael@hunch.co.nz'
const ENQUIRY_FROM = process.env.ENQUIRY_FROM || 'Robot Under Your Bed <hello@robotunderyourbed.com>'
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Five sends per address per hour is plenty for a person and dull for a bot.
const recent = new Map()
function tooMany(ip) {
  const now = Date.now(), hour = 60 * 60 * 1000
  const hits = (recent.get(ip) || []).filter(t => now - t < hour)
  hits.push(now)
  recent.set(ip, hits)
  if (recent.size > 5000) recent.clear()
  return hits.length > 5
}

app.post('/api/enquiry', express.json({ limit: '8kb' }), async (req, res) => {
  const { name = '', email = '', message = '', website = '' } = req.body || {}

  // Honeypot: people never see this field. Bots get a polite yes and no email.
  if (website) return res.json({ ok: true })

  const n = String(name).trim().slice(0, 120)
  const e = String(email).trim().slice(0, 200)
  const m = String(message).trim().slice(0, 2000)
  if (!n || !EMAIL_OK.test(e)) return res.status(400).json({ error: 'invalid' })
  if (tooMany(req.ip)) return res.status(429).json({ error: 'slow_down' })

  if (!process.env.RESEND_API_KEY) {
    console.error('enquiry: RESEND_API_KEY not set')
    return res.status(503).json({ error: 'not_configured' })
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: ENQUIRY_FROM,
        to: [ENQUIRY_TO],
        reply_to: e,
        subject: `Book enquiry from ${n}`,
        text: `${n} <${e}> wants a copy of There's a Robot Under Your Bed.\n\n` +
              (m ? `They said:\n${m}\n` : 'No message.\n') +
              `\n— sent from robotunderyourbed.com`,
      }),
    })
    if (!r.ok) {
      console.error('enquiry: resend', r.status, await r.text())
      return res.status(502).json({ error: 'send_failed' })
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('enquiry:', err)
    res.status(502).json({ error: 'send_failed' })
  }
})

// One page. Anything else comes back to it.
app.use((req, res) => res.sendFile(path.join(__dirname, 'public/index.html')))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`robotunderyourbed listening on ${PORT}`)
})
