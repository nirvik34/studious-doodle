# StrokeCheck (monorepo)

This repo is structured as:

- `client/` — React (Vite) web app (JSX + vanilla CSS)
- `server/` — Node.js API (Express)
- `model/` — shared risk scoring logic (pure JS package)

## Run (development)

In one terminal:

- `npm run dev:server`

In another terminal:

- `npm run dev:client`

Then open the client URL shown by Vite (usually `http://localhost:5173`).

## Build (client)

- `npm run build:client`
- `npm run preview:client`

## Notes

- This app is for early screening guidance only and is **not** a diagnosis.
- For urgent FAST symptoms, use Emergency and call local emergency services.
