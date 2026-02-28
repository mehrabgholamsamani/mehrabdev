# Portfolio (React + TypeScript)

This is your existing HTML/CSS/JS portfolio migrated into a Vite + React + TypeScript project.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes
- Your original markup is preserved as HTML (rendered via `dangerouslySetInnerHTML`) to keep the look identical.
- All inline `<script>` blocks were moved into `src/legacy/initPortfolio.ts` and run on mount.
- Next step (optional): progressively convert sections into real React components and remove direct DOM manipulation.
