// GameArea.jsx
import React, { forwardRef } from 'react';
import './GameArea.css';
import { maps } from '../map';

const GameArea = forwardRef(({ playerPosition, playerRef, currentLocation }, ref) => {
  const selectedCharacter = JSON.parse(localStorage.getItem('selectedCharacter'));
  const playerImg = selectedCharacter?.img || 'assets/default.png';

  const mapData = currentLocation?.id ? maps[currentLocation.id] : maps.Default;

  return (
    <div
      className="game-area"
      id="gameArea"
      ref={ref}
      style={{ backgroundImage: mapData.background }}
    >
      {mapData.planets.map((planet) => (
        <img
          key={planet.id}
          id={planet.id}
          src={planet.src}
          className="circle-img"
          style={planet.style}
          alt={planet.id}
        />
      ))}

      <img
        id="player"
        ref={playerRef}
        src={playerImg}
        alt="Player"
        style={{
          position: 'absolute',
          left: `${playerPosition.x}px`,
          top: `${playerPosition.y}px`,
          width: '5vw',
          height: '5vw',
          borderRadius: '50%',
          objectFit: 'cover',
          transform: `rotate(${playerPosition.rotation || 0}deg)`, // Add rotation
          transition: 'transform 0.2s ease', // Smooth rotation
        }}
      />

      {mapData.building && (
        <img
          src={mapData.building.src}
          alt={mapData.building.name}
          className="building"
          style={mapData.building.style}
        />
      )}
    </div>
  );
});

export default GameArea;