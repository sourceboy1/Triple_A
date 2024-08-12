import React from 'react';
import loadingGif from '../pictures/loading.gif'; // Adjust the path as needed
import './Loading.css'; // Create a CSS file for styling

const Loading = () => {
  return (
    <div className="loading-container">
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
    </div>
  );
};

export default Loading;
