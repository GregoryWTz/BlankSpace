import React from 'react';
import './GameOver.css';

const GameOver = ({ onRestart }) => {
  return (
    <div className="game-over">
      <div style={{ textAlign: 'center' }}>
        Game Over
        <br /><br />
        <button onClick={onRestart} className="restart-button">
          Restart
        </button>
      </div>
    </div>
  );
};

export default GameOver;