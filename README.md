# GroceryTracker

A single-page React app for comparing grocery prices across Trader Joe's, Safeway, Target, Lucky's, and Raley's. Data persists in `localStorage`.

## Features

- **Add price entries** — name, store, price, and date (Trader Joe's is date-free, treated as a stable baseline)
- **Comparison table** — all items side-by-side with the cheapest store highlighted in green
- **Price history chart** — line chart per item showing price over time; Trader Joe's shown as a flat reference line
- **Autocomplete** — item name field suggests previously entered items
- **Frequently tracked** — items with 2+ entries are surfaced automatically as quick-access chips
- **Search** — filter the table by item name
- **Delete** — remove individual price entries or entire items from the detail modal

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Building for production

```bash
npm run build
```

Output goes to `dist/`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com](https://vercel.com).
3. Vercel auto-detects Vite — no extra configuration needed beyond the included `vercel.json`.

## Tech stack

- [Vite](https://vite.dev) + React 19
- [Recharts](https://recharts.org) for the price history chart
- `localStorage` for persistence (no backend required)
