import React from 'react';
import { useBugs } from './hooks/useBugs';
import BugForm from './components/BugForm/BugForm';
import BugList from './components/BugList/BugList';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  const { bugs, loading, error, addBug, modifyBug, removeBug } = useBugs();

  const handleBugCreated = (newBug) => {
    console.log('New bug created:', newBug);
  };

  if (loading) return <div className="loading">Loading bugs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app-container">
      <h1>Bug Tracker</h1>
      <ErrorBoundary>
        <div className="app-content">
          <div className="form-section">
            <h2>Report a New Bug</h2>
            <BugForm onBugCreated={handleBugCreated} addBug={addBug} />
          </div>
          <div className="list-section">
            <ErrorBoundary>
              <BugList 
                bugs={bugs} 
                onStatusChange={modifyBug} 
                onDelete={removeBug} 
              />
            </ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;