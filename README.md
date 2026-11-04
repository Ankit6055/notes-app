# Notes

A small notes app built with Next.js. Notes are saved to your browser's `localStorage`, so there's no backend and nothing leaves your machine.

- Create, edit and list notes. The list is sorted by most recently edited.
- Changes save as you type. Other open tabs stay in sync through the `storage` event.
- On narrow screens it switches between the list and the editor.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # Vitest + Testing Library
```

## Layout

| Path | What it does |
| --- | --- |
| `lib/notes.ts` | Note type and pure helpers: parse, create, update, sort |
| `lib/notes-store.ts` | `localStorage` read/write, exposed as a `useSyncExternalStore` hook |
| `app/notes-app.tsx` | The client UI: sidebar list and editor |
| `*.test.ts(x)` | Unit tests for the helpers and an interaction test for the UI |
