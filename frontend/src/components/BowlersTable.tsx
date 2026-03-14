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

function BowlersTable() {
  // State to hold the fetched list of bowlers
  const [bowlers, setBowlers] = useState<Bowler[]>([]);

  // State to track loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to hold any error message
  const [error, setError] = useState<string | null>(null);

  // Fetch bowler data from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5177/api/bowlers')
      .then((response) => {
        // Throw an error if the response is not OK (e.g. 404, 500)
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
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
