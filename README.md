# Sai Prasanth — Portfolio

A personal portfolio built as a cinematic intro that resolves into an interactive
retro terminal. No framework, no build step, no dependencies — just HTML, CSS, and
vanilla JavaScript.

**Live:** [sai-prasanth.pplx.app](https://sai-prasanth.pplx.app)

## The idea

The landing state is a dark room with a figure at a piano and a rope hanging from
the ceiling. Pulling the rope lights the room, the character stands, walks to a
desk, sits down, and the camera pushes into the monitor — which is where the
terminal UI emerges. From there the whole portfolio is navigable as a shell.

Only two things are clickable during the intro: the rope and the music toggle. Any
key or the skip button exits straight to the terminal, and returning visitors skip
the intro automatically.

## Stack

| Layer      | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Markup     | Single `index.html`                                             |
| Styling    | Hand-written CSS with custom properties, OKLCH colors           |
| Behavior   | Vanilla ES modules in `app.js` — no framework, no bundler       |
| Content    | `data.js` — projects, stack, timeline, and bio as plain data    |
| Hosting    | Perplexity `pplx.app`, also deployable to Vercel                |

## Layout

```
index.html          markup + inline SVG logo + noscript fallback
style.css           all component and intro styling
base.css            resets and design tokens
app.js              intro sequence, terminal, hash router, audio
data.js             all content (edit this, not the markup)
build-noscript.mjs  regenerates the noscript block from data.js
assets/intro/       four intro scenes, WebP + JPEG at 960px and 1600px
assets/audio/       intro music, m4a + mp3
```

## Notable implementation details

**Rope alignment.** The rope the user pulls is a real button positioned on top of
the rope painted into the artwork. Because the scene uses `object-fit: cover`, the
painted rope shifts on screen at any aspect ratio other than 16:9, so its position
is projected through the cover transform on load and resize rather than hardcoded
as a percentage. On portrait viewports the painted rope is cropped out of frame
entirely, so the element draws a full rope of its own instead.

**Progressive enhancement.** The `<noscript>` block contains the full portfolio as
styled, readable, indexable HTML, generated from `data.js` by `build-noscript.mjs`.
The site is crawlable and usable with JavaScript disabled.

**Accessibility.** `prefers-reduced-motion` skips the intro entirely and goes
straight to content. The intro is keyboard-operable and escapable at any point.

**Storage.** Preferences (intro-seen, music choice) use feature-detected local
storage with an in-memory fallback, so the site works in sandboxed contexts where
storage access throws.

**Payload.** First load is roughly 550 KB. Audio is `preload="none"` so it never
blocks first paint.

## Running locally

No install step:

```bash
python3 -m http.server 8181
# open http://localhost:8181
```

After editing `data.js`, regenerate the no-JavaScript fallback:

```bash
node build-noscript.mjs
```

## Editing content

All copy, projects, stack entries, and timeline items live in `data.js`. `PROJECTS`
entries carry a slug used for deep links — each project is addressable at
`#/projects/<slug>`, and the back button restores both the section and the selected
project.

## Credits

Intro artwork is AI-generated. The intro music is a film soundtrack included for
personal demonstration only and is not licensed for redistribution — replace
`assets/audio/` before reusing this project.
