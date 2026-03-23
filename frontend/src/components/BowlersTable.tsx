// BowlersTable.tsx — Table component that displays Marlins & Sharks bowlers
// Fetches bowler data from the ASP.NET backend API on mount

import { useEffect, useState } from 'react';

// TypeScript interface for a single bowler record returned by the API
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

// Ordered list of backend URLs to try when loading bowler data.
// You can override this completely with VITE_API_BASE_URL.
const backendCandidates: string[] = [
  ...(import.meta.env.VITE_API_BASE_URL
    ? [String(import.meta.env.VITE_API_BASE_URL)]
    : []),
  'http://localhost:5181',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179'
];

function BowlersTable() {
  // State to hold the fetched list of bowlers
  const [bowlers, setBowlers] = useState<Bowler[]>([]);

  // State to track loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to hold any error message
  const [error, setError] = useState<string | null>(null);

  // Attempts each backend port in sequence until one responds successfully.
  const fetchBowlersWithFallback = async (): Promise<Bowler[]> => {
    let lastErrorMessage = 'Unable to reach backend API.';

    for (const baseUrl of backendCandidates) {
      const response = await fetch(`${baseUrl}/api/bowlers`).catch(() => null);

      // If fetch failed completely (network/CORS/etc.), try the next port.
      if (!response) {
        lastErrorMessage = `Could not connect to ${baseUrl}`;
        continue;
      }

      // If endpoint exists and responds successfully, use this data.
      if (response.ok) {
        return (await response.json()) as Bowler[];
      }

      lastErrorMessage = `${baseUrl} responded with ${response.status}`;
    }

    throw new Error(lastErrorMessage);
  };

  // Fetch bowler data from the backend when the component mounts
  useEffect(() => {
    fetchBowlersWithFallback()
      .then((data: Bowler[]) => {
        // Store the bowler data in state
        setBowlers(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        // Capture any network or parse errors
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array — runs once on mount

  // Show a loading message while waiting for the API response
  if (loading) {
    return <p className="loading-message">Loading bowlers...</p>;
  }

  // Show an error message if the fetch failed
  if (error) {
    return <p className="error-message">Error loading bowlers: {error}</p>;
  }

  // Helper to get the CSS class for team badge styling
  const getTeamBadgeClass = (teamName: string): string => {
    return teamName.toLowerCase() === 'marlins' ? 'marlins' : 'sharks';
  };

  return (
    // Card container for the table
    <div className="table-card">
      <table className="bowlers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {/* Render one row per bowler using .map() */}
          {bowlers.map((bowler, index) => (
            <tr key={index}>
              {/* Combine first name, middle initial (if present), and last name */}
              <td>
                {bowler.bowlerFirstName}{' '}
                {bowler.bowlerMiddleInit ? `${bowler.bowlerMiddleInit}. ` : ''}
                {bowler.bowlerLastName}
              </td>
              <td>
                {/* Team name displayed as a colored badge */}
                <span
                  className={`team-badge ${getTeamBadgeClass(bowler.teamName)}`}
                >
                  {bowler.teamName}
                </span>
              </td>
              <td>{bowler.bowlerAddress}</td>
              <td>{bowler.bowlerCity}</td>
              <td>{bowler.bowlerState}</td>
              <td>{bowler.bowlerZip}</td>
              <td>{bowler.bowlerPhoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BowlersTable;
