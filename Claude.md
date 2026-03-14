# Project Overview
Building a Bowling League website with a .NET 10 / C# backend API and a React / TypeScript frontend. The app reads from `BowlingLeague.sqlite` and displays bowler information for the **Marlins** (TeamID 1) and **Sharks** (TeamID 2) teams only.

## Project Structure
- `frontend/` — React + TypeScript frontend (Vite)
- `backend/` — .NET 10 / C# Web API
- `BowlingLeague.sqlite` — SQLite database at the repo root
- Git repo initialized at root level; `.gitignore` ignores `node_modules`, `bin/`, `obj/`

---

## Assignment Requirements (Mission 10)

### Data to Display (per bowler)
- Full name: First, Middle Initial, Last
- Team Name
- Address: Street, City, State, Zip
- Phone Number

### Filtering
- **Only show bowlers on Marlins (TeamID=1) or Sharks (TeamID=2) teams.**

### Component Structure
1. **`<Header />`** — heading component describing the page (e.g. "Bowling League — Marlins & Sharks")
2. **`<BowlersTable />`** — table component that fetches and lists all qualifying bowlers
3. **`<App />`** — root component that renders `<Header />` and `<BowlersTable />`

---

## Database Schema (key tables)

**Bowlers**
- `BowlerID` (PK)
- `BowlerFirstName`, `BowlerMiddleInit`, `BowlerLastName`
- `BowlerAddress`, `BowlerCity`, `BowlerState`, `BowlerZip`
- `BowlerPhoneNumber`
- `TeamID` (FK → Teams)

**Teams**
- `TeamID` (PK)
- `TeamName`

**SQL to fetch the right bowlers:**
```sql
SELECT b.BowlerFirstName, b.BowlerMiddleInit, b.BowlerLastName,
       b.BowlerAddress, b.BowlerCity, b.BowlerState, b.BowlerZip,
       b.BowlerPhoneNumber, t.TeamName
FROM Bowlers b
JOIN Teams t ON b.TeamID = t.TeamID
WHERE t.TeamName IN ('Marlins', 'Sharks')
ORDER BY t.TeamName, b.BowlerLastName;
```

---

## Backend Setup (.NET 10 / C#)

- Project is in `backend/` (`backend.csproj`)
- Use **Microsoft.Data.Sqlite** NuGet package to connect to the SQLite database
- The `.sqlite` file is at the repo root — reference it with a relative path from the backend (e.g., `../BowlingLeague.sqlite`) or use `appsettings.json` for the connection string
- Add **CORS** so the React dev server (port 5173) can call the API
- Create a minimal API endpoint: `GET /api/bowlers` that returns the filtered bowler list as JSON
- Define a `Bowler` record/class with all required fields
- Remove the sample `WeatherForecast` endpoint
- Include comments throughout

**Connection string in `appsettings.json`:**
```json
{
  "ConnectionStrings": {
    "BowlingLeague": "Data Source=../BowlingLeague.sqlite"
  }
}
```

**`Program.cs` structure:**
1. Add CORS policy allowing `http://localhost:5173`
2. Register `IDbConnection` or open `SqliteConnection` in the endpoint handler
3. Map `GET /api/bowlers` → query DB → return `List<Bowler>`

---

## Frontend Setup (React + TypeScript + Vite)

- Project is in `frontend/`
- Prettier config (`prettierrc.json`): `"semi": true`, `"singleQuote": true`, `"jsxSingleQuote": false`, `"trailingComma": "es5"`, `"printWidth": 80`, `"tabWidth": 2`, `"endOfLine": "auto"`
- ESLint with `eslint-config-prettier` and `eslint-plugin-prettier` installed
- Use `fetch` (or axios) to call `http://localhost:{backendPort}/api/bowlers`

**TypeScript interface:**
```ts
interface Bowler {
  bowlerFirstName: string;
  bowlerMiddleInit: string | null;
  bowlerLastName: string;
  bowlerAddress: string;
  bowlerCity: string;
  bowlerState: string;
  bowlerZip: string;
  bowlerPhoneNumber: string;
  teamName: string;
}
```

**Components:**
- `src/components/Header.tsx` — displays page title/description
- `src/components/BowlersTable.tsx` — fetches `/api/bowlers`, renders an HTML `<table>` with all required columns
- `src/App.tsx` — renders `<Header />` and `<BowlersTable />`

---

## General Guidelines
- Always include comments throughout all code (both frontend and backend).
- Use React Fragments (`<> </>`) instead of `div` wrappers whenever possible.
- Strictly define TypeScript types/interfaces for all component props.
- When rendering lists, use the `.map()` function.
- Use Prettier and ESLint as code formatters for the frontend.
- No extra features beyond what the assignment specifies.
