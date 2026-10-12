# IELTS Academic — Writing Task 1 + Reading Prep

Interactive prep webpage: lesson notes, auto-marked exercises, guided practice, and timed mock exams.

- **Writing Task 1** — 6 lessons (structure, paraphrase, overview, trend/comparison language, process & maps), 4 exercise drills, step-by-step guided writing, 20-minute mock with word counter + self-marking rubric.
- **Academic Reading** — all 11 question types, a dedicated **Match Headings lab**, auto-marked drills (T/F/NG, Y/N/NG, endings, summary gaps, features), guided passage walkthrough, 13-question timed mock with answer key.

## Use it instantly

Open **`IELTS-Task1-Prep.html`** in any browser — single self-contained file, works offline. No build needed.

## Develop

React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui.

```bash
cd ielts-writing-task1
pnpm install
pnpm dev      # local preview
pnpm run build  # outputs single-file dist/index.html (vite-plugin-singlefile)
```

Copy `dist/index.html` to the repo root as `IELTS-Task1-Prep.html` after rebuilding.
