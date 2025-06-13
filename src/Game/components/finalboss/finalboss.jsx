import React, { useState, useEffect } from 'react';
import './final.css';

const FinalBoss = ({ onExit }) => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [bossHealth, setBossHealth] = useState(200);
  const [gameLog, setGameLog] = useState(['Game started!']);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playerAction, setPlayerAction] = useState(null);
  const [bossAction, setBossAction] = useState(null);
  const [playerPosition, setPlayerPosition] = useState('center');
  const [bossPosition, setBossPosition] = useState('center');

  const playerActions = [
    { name: 'Attack', damage: 50, text: 'You swing your sword!' },
    { name: 'Heal', heal: 20, text: 'You drink a healing potion!' },
    { name: 'Block', defense: 0.5, text: 'You raise your shield!' },
    { name: 'Fireball', damage: 25, cost: 10, text: 'You cast a fireball!' }
  ];

  const bossActions = [
    { name: 'Claw Swipe', damage: 10, text: 'Boss swipes with its claws!' },
    { name: 'Dark Blast', damage: 20, text: 'Boss fires a dark energy blast!' },
    { name: 'Regenerate', heal: 15, text: 'Boss regenerates health!' },
    { name: 'Charge', damage: 30, text: 'Boss charges at you!' }
  ];

  const handlePlayerAction = (action) => {
    if (isAnimating || !isPlayerTurn) return;

    setPlayerAction(action);
    setIsAnimating(true);

    if (action.name === 'Attack' || action.name === 'Fireball') {
      setPlayerPosition('forward');
    } else if (action.name === 'Block') {
      setPlayerPosition('back');
    } else {
      setPlayerPosition('center');
    }

    addToLog(action.text);

    setTimeout(() => {
      if (action.damage) {
        setBossHealth(prev => Math.max(0, prev - action.damage));
      }
      if (action.heal) {
        setPlayerHealth(prev => Math.min(100, prev + action.heal));
      }

      setTimeout(() => {
        setPlayerPosition('center');
        setPlayerAction(null);
        setIsPlayerTurn(false);
        setIsAnimating(false);
      }, 500);
    }, 1000);
  };

  useEffect(() => {
    if (!isPlayerTurn && !isAnimating && bossHealth > 0 && playerHealth > 0) {
      setIsAnimating(true);
      const action = bossActions[Math.floor(Math.random() * bossActions.length)];
      setBossAction(action);

      if (action.name === 'Claw Swipe' || action.name === 'Charge') {
        setBossPosition('forward');
      } else {
        setBossPosition('center');
      }

      addToLog(action.text);

      setTimeout(() => {
        if (action.damage) {
          setPlayerHealth(prev => Math.max(0, prev - action.damage));
        }
        if (action.heal) {
          setBossHealth(prev => Math.min(200, prev + action.heal));
        }

        setTimeout(() => {
          setBossPosition('center');
          setBossAction(null);
          setIsPlayerTurn(true);
          setIsAnimating(false);
        }, 500);
      }, 1000);
    }
  }, [isPlayerTurn, isAnimating, bossHealth, playerHealth]);

  useEffect(() => {
    if (playerHealth <= 0) {
      addToLog('You have been defeated! Game Over!');
    } else if (bossHealth <= 0) {
      addToLog('You have defeated the boss! Victory!');
    }
  }, [playerHealth, bossHealth]);

  const addToLog = (message) => {
    setGameLog(prev => [message, ...prev].slice(0, 10));
  };

  const isBattleOver = playerHealth <= 0 || bossHealth <= 0;

  return (
    <div className="game-container">
      <h1>Boss Battle</h1>

      <div className={`boss-container ${bossPosition} ${bossAction ? 'action-' + bossAction.name.toLowerCase().replace(' ', '-') : ''}`}>
        <div className="health-bar-container">
          <div 
            className="health-bar boss-health" 
            style={{ width: `${(bossHealth / 200) * 100}%` }}
          ></div>
          <div className="health-text">{bossHealth}/200</div>
        </div>
        <div className="character boss"></div>
        <div className="name-tag">Big Worm</div>
      </div>

      {/* Battle Log */}
      <div className="battle-log">
        <h3>Battle Log:</h3>
        <ul>
          {gameLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      <div className={`player-container ${playerPosition} ${playerAction ? 'action-' + playerAction.name.toLowerCase() : ''}`}>
        <div className="health-bar-container">
          <div 
            className="health-bar player-health" 
            style={{ width: `${playerHealth}%` }}
          ></div>
          <div className="health-text">{playerHealth}/100</div>
        </div>
        <div className="character player"></div>
        <div className="name-tag">Player</div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {playerActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handlePlayerAction(action)}
            disabled={isAnimating || !isPlayerTurn || isBattleOver}
            className={`action-btn ${action.name.toLowerCase()}`}
          >
            {action.name}
            {action.cost && <span className="mana-cost">MP: {action.cost}</span>}
          </button>
        ))}
      </div>

      {isBattleOver && (
        <button
          className="reset-btn"
          onClick={() => onExit(bossHealth <= 0)}
        >
          Return to Game
        </button>
      )}

      <div className={`turn-indicator ${isPlayerTurn ? 'player-turn' : 'boss-turn'}`}>
        {isBattleOver ? 'Battle Over' : isPlayerTurn ? 'Your Turn' : 'Boss Turn'}
      </div>
    </div>
  );
};

export default FinalBoss;
