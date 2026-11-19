# Abhishek Chugh · Portfolio

Next.js site, exported as static files for GitHub Pages at
`https://abhishekchugh707.github.io/`.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:3000/
```

## Change content

All text lives in `lib/data.ts`: name, role, bio, skills, projects, experience, links.
Your photo is `public/me.jpg`.

## Crowd footer art

Put your two images in `public/footer/`, replacing the placeholders:

- `character.png`: you, full body, transparent background
- `crowd.png`: 15 pedestrians in a 5 × 3 grid, transparent background

If `crowd.png` has the wrong grid or a solid background, the footer keeps
your character and links, and the browser console says what is wrong.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and
publishes the site. In the repo settings, set **Pages → Source** to
**GitHub Actions** once.
