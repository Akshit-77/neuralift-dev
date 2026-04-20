# ⬡ NeuralLift.dev

> Interactive portfolio website for a deep learning solutions company.

## Overview

NeuralLift.dev is a fully static, single-page portfolio site built for a hypothetical AI/deep learning company. It is designed for cloud hosting (AWS S3, Netlify, Vercel, GitHub Pages) with no backend required.

## Features

- **Animated neural network canvas** — 80 floating nodes with live mouse-repulsion interaction
- **Layer propagation diagram** — interactive architecture visualization in the About section
- **Project case studies** — filterable grid with animated previews (scan lines, chat bubbles, pipelines)
- **Scroll-triggered counters** — animated stats that fire on viewport entry
- **Testimonials carousel** — auto-advancing with dot navigation
- **Contact form** — ready to wire up with Formspree or EmailJS (no backend needed)
- **Cursor glow effect** — subtle radial gradient that follows the mouse
- **Fully responsive** — mobile hamburger menu, adaptive grids

## Tech Stack

| Layer | Choice |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, flex, animations) |
| Interactivity | Vanilla JavaScript (ES6+) |
| Font | Inter + JetBrains Mono via Google Fonts |
| Dependencies | None (zero npm, zero frameworks) |

## Project Structure

```
neuralift-dev/
├── index.html        # Single-page markup
├── css/
│   └── styles.css    # All styles, variables, responsive breakpoints
└── js/
    └── main.js       # Canvas animation, interactions, slider, counters
```

## Hosting on AWS S3

1. Create an S3 bucket and enable **Static website hosting** (index document: `index.html`)
2. Set the bucket policy to allow public read
3. Upload files preserving structure:

```bash
aws s3 sync ./ s3://your-bucket-name/ --delete
```

`index.html` must sit at the bucket root so relative paths (`css/`, `js/`) resolve correctly.

## Contact Form

The form submission is simulated by default. To make it live, replace the `await` in `js/main.js` with a real endpoint:

```js
await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(form))),
});
```

## Contact

**admin@neuralift.dev**
