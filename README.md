# robotunderyourbed.com

The website for **There's a Robot Under Your Bed** — *A little book about humans.
And AI.* by Michael Goldthorpe.

**Status: v1.2 — mobile is its own composition.**

### What's new in v1.2

- **Mobile rebuilt as a scrolling poster** (ruled 21 Aug, Michael). The title is
  big and fills the red; the thread grows up off the bed and pushes the title up
  the page and, eventually, off the top — real document scroll, so flicking back
  up finds it again. The bed anchors the footer as always; **the lockup moves
  under the bed** — same lockup as desktop, different location, Buy the bottom
  anchor. One state: no `body.chatting` overrides, no fixed positioning, no
  full-height inner scroller, and no value shared with a desktop `clamp()`.
- **The title is sized by two ceilings and the lower wins**, both measured: the
  widest line (YOUR BED) is 2.99× the font-size in Bebas, so
  `(100vw − 2·gut)/2.99` fills the measure flush; and the title block grows at
  3.28px per font px, so `(100svh − 550px)/3.28` is the biggest title that
  still leaves the bed on the arrival screen. Bed-on-screen outranks
  flush-right: a Pro Max gets a 92%-of-measure poster, an SE gives up a few
  percent rather than pushing the bed below the fold.
- **`.brand` and `.talk` dissolve on mobile** (`display:contents`) so title,
  thread, compose, bed and lockup become one flex column and the lockup can be
  ordered below the bed without duplicating any markup.
- **The red-fill occlusion patch on `.minor a` is removed** — nothing overlaps
  the bed any more.
- **The reader contains its scroll** (`overscroll-behavior`) now the mobile
  body scrolls beneath it.
- **The reader gets its own mobile numbers** (v1.2.1). Not a second composition
  — a white page is the same page at every size — but its margins were borrowing
  `--gut` from the red page and its type was vw-clamped, so every phone read
  differently. Now fixed: 18px side margins, 17.5px/1.6 body — a paperback
  measure. The block sits **after** the base `.reader` rules on purpose; same
  specificity, the cascade is the mechanism. The title also clears the close
  button now.
- Measured, not eyed: 390×844, 360×844, 430×932, 393×852 all fit the arrival
  screen exactly with zero horizontal overflow and no element overlaps;
  360×640 scrolls 19px at the 64px title floor. Desktop verified unchanged at
  1440×900.
- **Repo fix:** the tree had a stale `public/` with the current files nested
  inside it at `public/public/` — the server was one session behind. The
  current files (research key, dateline logic, circle favicon) are promoted to
  `public/` and the nest is gone.

### What's new in v1.1

- **The ROBOT box was too big.** The gap between one line's baseline and the
  next line's cap top is `.82 - .71 = .11em` — that is the entire budget. The box
  was bleeding `.20em` each way, nearly twice it, so it cut into the lines above
  and below. Now `.105em` each way: it meets the baseline above and the cap line
  below with half a thousandth of an em to spare, and stays symmetric.

- **The card is anchored right, not left.** Its right edge lands where the
  bubble's bottom-right bevel ends — inset by the 20px corner radius — and the
  left edge falls wherever the width leaves it. The card lives inside the
  message block, so `100%` is the bubble's own width; `margin-left:auto` is the
  whole anchor.
- **The width is constant.** `--tuck-w` is `46cqh` (max 450px), sized off the
  longest lines in the set and scaling with the same container height that drives
  the headline and the bed. They were 330px against 285px of type, so eight of
  fourteen chapters wrapped to a third line. **0 of 22 wrap** at 1280×760,
  1366×768, 1440×900, 1512×982 and 1920×1200 — for a long answer *and* a
  one-line one.
- **A bubble carrying a card is never narrower than the card.** A short answer
  used to leave the card overhanging it. The message block now takes a
  `min-width` off `--tuck-w`, so the bubble stretches to hold the card instead.
- **The book icon is top-aligned**, hung off the title's cap line rather than
  floating against the block's centre — the icon labels the title, not the card.
- **The arrow is a solid red disc with a white arrow**, so it reads as a control
  rather than a piece of punctuation. The slide-on-hover is kept.
- **Narrow phones**: the indent drops from 22px to 14px and the padding tightens,
  which claws back enough width to take 390px from four wrapping cards to one.
  At 360px, seven still take a third line — a 53-character italic line cannot sit
  on one line at a readable size on a 360px screen, and shrinking the type far
  enough to do it costs more than the wrap does.

### What's new in v1.0

- **The artwork had 28 rows of fully transparent padding at its base** — an
  artefact of the optimise-then-quantise pass. The boxes aligned at 0px while the
  visible ink floated 13.5px above the CTA. Trimmed.
- **The baseline is now set on visual mass, not the bounding box.** The bed's
  ground line is raked: its lowest point is one thin post foot, and the
  shoes-and-near-post cluster sits 4.58% of the artwork's height above it. The bed
  is dropped by exactly that, so the heavy cluster lands on the line and the post
  foot crosses it by ~12px. Expressed as a percentage, so it holds at any size.
- **CTA up ~10%.** Because the two pills total the hero's width, the whole lockup
  gains presence horizontally as well as vertically.

### What's new in v0.9

- **More air above the title**, and both bottom blocks lifted. They share a
  baseline, so raising the bottom padding moves the bed and the lockup together
  and closes the title-to-CTA gap in the same move.
- **The size container was eating itself.** Container units resolve against the
  *content* box, so every pixel of padding added to `.wrap` shrank the headline
  and the bed — which reopened the gap it was meant to close. The composition is
  now `.stage` (sized, container) wrapping `.wrap` (padded), so padding and scale
  are independent.

  At 1272×848 that alone took the headline from 99px to 127px, the bed from 206px
  to 263px, and the title-to-CTA gap from 210px down to 93px.

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
