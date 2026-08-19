# robotunderyourbed.com

The website for **There's a Robot Under Your Bed** — *A little book about humans.
And AI.* by Michael Goldthorpe.

**Status: v0.8 — composition locked.**

### What's new in v0.8

- **The hamburger is gone**, markup and CSS.
- **Title anchored at the top** of the brand column, with the strapline welded to
  it. (The desktop rule was still overriding with `flex-end`, which is why the
  headline stayed low in v0.7 even though the column was meant to be spaced apart.)
- **About before Fact check.**
- Prompt is now *Why is there a cow in this book?*
- **The two columns are locked to each other.** `.wrap` is a size container and
  everything inside is measured in `cqh` — a fraction of the composition's own
  height. Previously the headline scaled on `vh`, the bubbles on `vw` and the bed
  on `vh`, so changing the window's shape changed the relationships between them.
  Now one number drives all of it. Verified: the title-to-bed ratio is identical
  at 1440×900, 1440×1200, 1920×1080, 1930×1660 and 1280×760. The layout and the interaction are real.
The robot's replies are Claude's stand-ins matched on keywords in the browser —
no model, no server calls, no email. Buy the book still goes nowhere.

### What's new in v0.7

- **The lockup** — two hollow pills (Fact check / About) above the hero
  *Why not buy the book?*. The pair totals the hero's width, which is what makes
  it one object. Subordinates sit **above** so the hero keeps the baseline it
  shares with the bed. The burger is gone.
- **Cards** — indented, square-cornered, arrow pinned right (slides on hover),
  smaller. First mention gets a card; repeats drop to a quiet underlined link.
- **The ROBOT box bleeds evenly.** It was hanging 0.10em low — Bebas Neue's
  ascender-to-cap gap is .09em but its descender is .19em, and the background was
  drawn to the line box. Now drawn as a pseudo-element with measured offsets;
  verified symmetric to within an eighth of a pixel.
- **A "something else" intent** — *different chapter? / another one / what else*
  now offers a chapter you haven't been shown, instead of deflecting as off-book.
- **Real focus, no fake caret.** The blinking line was drawn in CSS whether or not
  the field had focus, so typing did nothing until you clicked. Now the field is
  genuinely focused on load — desktop width and a real pointer only, because on a
  phone that opens the keyboard on arrival and collapses the layout. Typing
  anywhere on the page also lands in the field.
- **A prompt in the reader's voice** — *why is there a cow in this book*. The
  empty bubble is the reader's, so a robot line would be the wrong mouth, and the
  black bubble above already does the instructing.
- Left column spaced apart, shorter thread fade, separate nudge copy for sidebars.

### What was new in v0.5

- **Recommendation cards** — red chapter title, black why-line, book glyph. Sidebars
  show the title only (they have no why-line in the book).
- **Chapter reader** — a full-screen modal with the **real chapter text**, pulled
  from the final manuscript into `public/chapters.json` (22 pieces, ~14,500 words).
  White page, black serif, red section heads, TLDR in a black box.
- **A gentle nudge** at the end of each chapter that escalates over three reads.
  Never blocks, no counters, no wall.
- **The bed bridges the columns** — it's sized off viewport *height* and runs wider
  than its own column, crossing the gutter so the two halves interlock.
- **Both columns bottom-align**, so Buy's baseline and the bed's baseline are the
  same line.
- More side padding, and the chat is smaller again.

### How it behaves

One thread. Type in the blank speech bubble and the exchange appears above it.
The **bed is anchored** and never scrolls away — the thread grows upward off it
and older messages scroll out under the title. The input never moves.

On mobile mid-chat the title collapses to a single line and Buy drops to the
bottom-left corner beside the bed, in thumb reach.

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

- **Stand-in** — every robot reply in the `ROUTES` table in `index.html`, plus the
  fallbacks. All of it written to the pattern so the page can be felt. None is
  canon. In the real build these become Michael's lines in a table on the
  server, and the model's only job is choosing which line comes next — it never
  generates prose.
- **Canon** — the title lockup, the strapline, "Ask me about the book", the Buy
  label, the colours, the *Read:* link.

---

## TODO

- [ ] **Move the routing server-side.** `ROUTES` currently lives in the browser,
      which is fine for a mock and wrong for launch — the copy table and the
      model call both belong behind `/api/chat`.
- [ ] Chapter reader behind the *Read:* links. Text comes from the final
      manuscript.
- [ ] Burger contents: Michael's name, Check the facts (`/facts`), and whatever
      else. Currently does nothing.
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
