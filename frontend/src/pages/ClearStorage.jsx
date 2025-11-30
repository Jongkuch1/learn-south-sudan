import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClearStorage = () => {
  const navigate = useNavigate();
  const [cleared, setCleared] = useState(false);

  const clearAll = () => {
    localStorage.clear();
    setCleared(true);
    alert('Storage cleared! Please refresh the page.');
  };

  const clearBookings = () => {
    localStorage.removeItem('ssplp_bookings');
    alert('Bookings cleared!');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Clear Storage</h1>
      <p>Your browser storage is full. Clear it to continue using the platform.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={clearBookings}
          style={{ padding: '1rem', fontSize: '1.1rem', background: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Clear Bookings Only
        </button>
        
        <button 
          onClick={clearAll}
          style={{ padding: '1rem', fontSize: '1.1rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Clear All Storage
        </button>
        
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ padding: '1rem', fontSize: '1.1rem', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </div>
      
      {cleared && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#4CAF50', color: 'white', borderRadius: '8px' }}>
          Storage cleared successfully! Refresh the page to continue.
        </div>
      )}
    </div>
  );
};

export default ClearStorage;
