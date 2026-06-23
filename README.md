# Letian Qi Academic Homepage

Personal academic homepage for GitHub Pages, built with React 18, TypeScript, Vite, Tailwind CSS, framer-motion, and lucide-react.

The page organizes research directions and topic-based paper lists for molecular structure generation, 3D generation, and weight-space generation.

## Paper PDFs

Put PDF files in `public/papers/`, then add a paper entry in the matching category inside `src/App.tsx`:

```ts
{
  title: 'Paper title',
  authors: 'Author list',
  meta: 'Venue or year',
  abstract: 'Short reading note.',
  tags: ['tag'],
  pdfUrl: '/papers/example.pdf'
}
```

The homepage links to topic pages such as `/#topic/weights`. Entries with `pdfUrl` open the PDF directly in a new browser tab.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build step also syncs the generated `index.html`, `assets/`, and `papers/` into the repository root so the current branch-root GitHub Pages deployment can serve the site directly.
