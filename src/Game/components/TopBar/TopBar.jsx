import React from 'react';
import './TopBar.css';

const TopBar = ({ barValues, gameTime, currency, playerName }) => {
  const hour = gameTime.hours;
  let timeGreeting = "Hello";

  if (hour >= 5 && hour < 12) timeGreeting = "Good Morning";
  else if (hour >= 12 && hour < 17) timeGreeting = "Good Afternoon";
  else if (hour >= 17 && hour < 21) timeGreeting = "Good Evening";
  else timeGreeting = "Good Night";

  return (
    <div className="top-bar">
      <div id="greeting">{`${timeGreeting} ${playerName || 'Player'}`}</div>

      <div id="topRightContainer">
        <div id="clockContainer">
          🕒 {String(gameTime.hours).padStart(2, '0')}:
          {String(gameTime.minutes).padStart(2, '0')}
        </div>
        <div id="currencyDisplay">
          <span>💰</span> {currency}
        </div>
      </div>

      <div className="status-bars">
        {barValues.map((value, index) => (
          <div className="status" key={index}>
            <img 
              src={`assets/${
                index === 3 
                  ? (barValues[3] >= 70 ? 'happiness1' 
                    : barValues[3] >= 30 ? 'happiness2' 
                    : 'happiness3')
                  : ['fork', 'hygine', 'energy'][index]
              }.png`}
              className="status-icon" 
              alt="Status"
            />
            <div className="status-bar">
              <div 
                className="status-fill" 
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBar;
