// Header.tsx — Heading component for the Bowling League app
// Displays a title and brief description inside a styled card

// No props needed for this static heading component
function Header() {
  return (
    // Card container for the header with gradient background
    <div className="header-card">
      <h1>🎳 Bowling League</h1>
      <p>Bowler roster for the Marlins and Sharks teams</p>
    </div>
  );
}

export default Header;
