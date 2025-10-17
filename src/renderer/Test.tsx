// Simple test component to verify React is working
import React from 'react';

const Test: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      background: '#1e293b',
      color: 'white',
      fontFamily: 'Arial',
      minHeight: '100vh'
    }}>
      <h1>🎲 Catan Analyzer - Test</h1>
      <p>If you can see this, React is working!</p>
      <button
        onClick={() => alert('Button works!')}
        style={{
          padding: '10px 20px',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Click Me
      </button>
    </div>
  );
};

export default Test;
