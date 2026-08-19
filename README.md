# robotunderyourbed.com

The website for **There's a Robot Under Your Bed** — *A little book about humans.
And AI.* by Michael Goldthorpe.

**Status: v0.1 — the page does nothing.** It's a static hero, built to get the
visuals right. No chat, no email, no working buttons.

---

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm start` for the production command (this is what Railway runs).

---

## Deploy to Railway

It's a plain Node app, so Railway needs no config file.

1. Push this repo to GitHub.
2. Railway → **New Project → Deploy from GitHub repo**.
3. That's it. Railway detects Node, runs `npm ci` then `npm start`.

Then:

- **Networking → Generate Domain** to get a `*.up.railway.app` URL for testing.
- **Custom Domain** → add `robotunderyourbed.com` and `robotunderyourbed.co.nz`,
  and point the DNS at the CNAME Railway gives you. Both currently resolve to a
  parking page, so those records need changing.
- Health check path is `/healthz` if you want to set one.

The server binds `process.env.PORT` on `0.0.0.0`, which is what Railway requires.

### Environment variables

None are required for v0.1. See `.env.example`.

| Variable | When |
|---|---|
| `CANONICAL_HOST` | Once you've decided whether `.com` or `.co.nz` is canonical. The other then 301s to it. Unset = both serve the same page. |
| `ANTHROPIC_API_KEY` | When the robot gets built. Server-side only. |
| `RESEND_API_KEY` | Only if email capture happens. Undecided. |

---

## Structure

```
server.js              Express 5. Static files, health check, /api/chat stub.
public/
  index.html           The whole page. Inline CSS — it's one page.
  assets/
    robot-bed.png      Stuart Hinds' cover art, trimmed and quantised (21KB).
    bebas-neue-400.woff2
```

### Why it's a Node app and not a static bucket

The robot routes through Claude — one API call per message — and the key can't
sit in the browser. `/api/chat` is stubbed at 501 so the shape exists now and
there's no migration later.

---

## Design canon

| | |
|---|---|
| Red | `#ED1C24` — ruled 19 Aug. Same value print and screen. |
| Black | `#231F20` (used here, the cover value). The build brief says `#191818`. **Unresolved.** |
| White | `#FFFFFF` |
| Headline | Bebas Neue |
| Body | Zodiak (Fontshare CDN) |

### ⚠️ The headline weight

The book is set in **Bebas Neue Bold**, which is Bebas Neue *Pro* (Dharma Type,
paid). The free release bundled here is a **single weight** and reads lighter.

Hold the page next to the printed cover. If the headline looks thin, buy the Pro
licence and swap `public/assets/bebas-neue-400.woff2`. Nothing else changes.

---

## What's stand-in, what's canon

Per the working rules: **Michael writes all prose.** Anything Claude wrote is a
stand-in to be killed or kept, and is marked in the source.

- **Stand-in** — the three pills. Real ones are Michael's: ~45 of them, rotating
  three at a time, nothing repeating once read.
- **Canon** — the title lockup, "Let's chat.", the two button labels, the colours.

---

## TODO

- [ ] **Buy button has no destination.** Blocks price, format, and whether a
      retail exclusivity clause would kill the free chapters.
- [ ] Rule on black: `#231F20` or `#191818`.
- [ ] Decide the email question — does the page capture addresses or not.
- [ ] `og:image` — needs a 1200×630 share card.
- [ ] Favicon.
- [ ] Burger menu has nothing behind it.
- [ ] Robot + bed as **vector** from Stu. This PNG is derived from the print
      artwork and will not scale cleanly past ~1200px.
- [ ] Point the DNS. Both domains are on a parking page, and the URL is already
      printed in the book.
