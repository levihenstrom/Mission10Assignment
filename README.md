# Mission 10 - Bowling League App

This project is a full-stack app for IS 413 Mission 10:

- **Backend:** ASP.NET Core Web API (`backend/`)
- **Frontend:** React + TypeScript + Vite (`frontend/`)
- **Database:** SQLite file at the repo root (`BowlingLeague.sqlite`)

The app displays bowlers from **Marlins** and **Sharks** only.

## What This App Shows

For each qualifying bowler:

- First, middle initial, and last name
- Team name
- Address (street, city, state, zip)
- Phone number

## Prerequisites

Install these before running:

- [Node.js](https://nodejs.org/) (LTS recommended, includes `npm`)
- [.NET SDK](https://dotnet.microsoft.com/download) (version 10)

## Project Layout

- `frontend/` - React app
- `backend/` - ASP.NET Web API
- `BowlingLeague.sqlite` - SQLite database file used by backend

## Quick Start (Recommended)

From the repository root:

```bash
npm install
npm run install:frontend
npm run dev
```

This starts both servers:

- Frontend: `http://localhost:5173` (or next available Vite port)
- Backend API: `http://localhost:5181`

## Run Frontend and Backend Separately (Optional)

### Backend

```bash
dotnet run --project backend
```

API endpoint:

- `GET http://localhost:5181/api/bowlers`

### Frontend

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

Open the URL shown by Vite (usually `http://localhost:5173`).

## Connection String

The backend uses this connection string in `backend/appsettings.json`:

```json
"ConnectionStrings": {
  "BowlingLeague": "Data Source=../BowlingLeague.sqlite"
}
```

Because of this relative path, the database file should remain at the repository root.

## Build Commands

From the repository root:

```bash
npm run build
```

Or individually:

```bash
npm run build:frontend
npm run build:backend
```

## Troubleshooting

- If frontend shows fetch/network errors, confirm backend is running on `http://localhost:5181`.
- Frontend includes a backend-port fallback and will also try `5177`, `5178`, and `5179`.
- You can force a specific backend URL by setting `VITE_API_BASE_URL` in a `.env` file under `frontend/`.
- If backend fails to read data, confirm `BowlingLeague.sqlite` exists at repo root.
- If port `5173` is occupied, Vite may move to `5174`, `5175`, etc. (CORS already allows these ports).

