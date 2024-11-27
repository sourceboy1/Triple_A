import React from 'react';
import loadingGif from '../pictures/loading.gif'; // Adjust the path
import './Loading.css';

const Loading = () => (
  <div className="loading-container">
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
  </div>
);

export default Loading;
