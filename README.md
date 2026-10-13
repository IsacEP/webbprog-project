# Trivia Game

A small React trivia app using questions from [Open Trivia DB](https://opentdb.com/). You can play a configurable game, take a three-question daily quiz, and view a local leaderboard.

## Run locally

You need Node.js and npm. In the project directory, run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). An internet connection is needed to load new questions and the category list. You can also run `npm run build` and `npm run lint` to check the project.

## How it works

- **Play:** Choose 1-50 questions, a category, difficulty, and question type (multiple choice, true/false, or any). The app requests a new set from Open Trivia DB for that game.
- **Daily quiz:** Enter a name and answer three questions. The questions are cached for the day in your browser, with one saved result per name and day.
- **Leaderboard:** Completed daily results are saved in browser `localStorage` and ranked by score, then time. Results are only visible in the same browser; they are not shared between devices. The daily questions may also differ between browsers.

## Tech and project structure

The app uses React, TypeScript, Vite, React Router, Tailwind CSS, and shadcn/ui components. Open Trivia DB supplies questions and categories without an API key.

- `src/router-config.tsx` defines the pages and the page-not-found route.
- `src/play.tsx`, `src/daily.tsx`, `src/game.tsx`, and `src/leaderboard.tsx` contain the main screens.
- `src/lib/opentdb.ts` builds API requests and converts question responses.
- `src/use-fetch-questions.ts` loads and caches questions.
- `src/lib/leaderboard.ts` reads and saves daily results.
- `src/components/` contains reusable UI components.
