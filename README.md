# robotunderyourbed.com

The website for **There's a Robot Under Your Bed** — *A little book about humans.
And AI.* by Michael Goldthorpe.

Node/Express on Railway. Railway deploys on every push to `main`.

## What's where

| File | What it holds |
|---|---|
| `server.js` | Serves the site, the `/api/enquiry` route for the Get the book form, health check |
| `public/index.html` | The whole site: page, styles, the robot's lines, About, the Get the book card |
| `public/chapters.json` | Every chapter and sidebar, text from the final V8 InDesign file, plus each chapter's nudge line |
| `public/facts.json` | The Fact check page |
| `public/assets/` | Fonts and images |

## Copy rules

- Copy marked **MG** in the code is Michael's and locked. **STAND-IN** is Claude's and killable.
- No generated prose. The robot only picks from Michael's lines.
- Chapter text comes from the printed book only (V8 InDesign export, 12 Oct 2026).
- Mobile and desktop styles never share values.

## The robot

`ROUTES` in `index.html`. Each reply lists its trigger words (whole words; a
trailing `*` matches any ending), what the robot says, and what it offers: a
chapter (`read`), a fresh chapter (`pick`), the Get the book button (`buy`), or
nothing. The first reply that matches wins, so order matters. Anything that
matches nothing gets the `FALLBACK` lines in turn.

## Get the book

The lockup button, every chapter nudge and the robot's buying answer all open
the same card. It posts to `/api/enquiry`, which emails Michael through Resend
with the visitor's address as reply-to. There's a honeypot for bots and a limit
of five sends per hour per visitor.

Railway variables:

| Variable | |
|---|---|
| `RESEND_API_KEY` | Required. Without it the form shows its error line. |
| `ENQUIRY_TO` | Optional. Default `michael@hunch.co.nz` |
| `ENQUIRY_FROM` | Optional. Default `Robot Under Your Bed <hello@robotunderyourbed.com>` (domain must be verified in Resend) |
| `CANONICAL_HOST` | Optional. Redirects the other domain to this one |

## Still open

- Robot: the hello reply and the opening bubble are stand-ins
- Real-device test on iPhone (keyboard with the form open, Zodiak, rotate)
- `og:image` share card; self-hosting Zodiak
