import React from 'react';
import './Loading.css'; // Import your custom styles for the Loading component

function Loading() {
  return (
    <div className="loading-container font-c">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loading;
