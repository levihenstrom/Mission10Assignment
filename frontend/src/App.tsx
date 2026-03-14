// App.tsx — Root application component
// Composes the Header and BowlersTable components

import './App.css';
import Header from './components/Header';
import BowlersTable from './components/BowlersTable';

// No props for the root App component
function App() {
  return (
    // Using React Fragment to avoid an unnecessary div wrapper
    <>
      {/* Page heading — describes what the page is about */}
      <Header />

      {/* Table listing all Marlins and Sharks bowlers */}
      <BowlersTable />
    </>
  );
}

export default App;
