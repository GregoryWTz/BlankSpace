import { useState, useEffect, useRef } from 'react';
import TopBar from './components/TopBar/TopBar';
import GameArea from './components/GameArea/GameArea';
import RightPanel from './components/RightPanel/RightPanel';
import GameOver from './components/GameOver/GameOver';
import FinalBoss from './components/finalboss/finalboss';
import { gameLoop, handleKeyDown, handleKeyUp, locations } from './gameLogic';
import './App.css';

function Game({ gameName, selectedShip, setPhase }) {
  useEffect(() => {
    document.title = "Blank Space - Game";
  }, []);


  const playerPosRef = useRef({ x: 80, y: 50, rotation: 0 });
  const keys = useRef({});
  const gameAreaRef = useRef(null);
  const playerRef = useRef(null);

  const [inBossBattle, setInBossBattle] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [pendingEffect, setPendingEffect] = useState(null);
  const [playerSpeed, setPlayerSpeed] = useState(2);

  const [cooldownEndTime, setCooldownEndTime] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [inventory, setInventory] = useState([
    { name: 'Health Potion', quantity: 3, affectsBar: 0, increaseBy: 20 },
    { name: 'Energy Drink', quantity: 2, affectsBar: 1, increaseBy: 15 },
    { name: 'Turbo Snack', quantity: 1, statBoost: { type: 'speed', value: 5, duration: 10000 } }
  ]);

  const [barValues, setBarValues] = useState([50, 50, 50, 50]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currency, setCurrency] = useState(150);
  const [gameTime, setGameTime] = useState({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
  });
  const [gameOver, setGameOver] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);

  const startCooldownTimer = () => {
    const endTime = Date.now() + 5000;
    setCooldownEndTime(endTime);
  };

  const applyPendingEffect = () => {
    if (!pendingEffect) return;

    const { type, payload } = pendingEffect;

    if (type === 'item') {
      const { item, index } = payload;
      if (item.affectsBar !== undefined) {
        setBarValues(prev =>
          prev.map((val, i) => i === item.affectsBar ? Math.min(100, val + item.increaseBy) : val)
        );
      }
      if (item.statBoost?.type === 'speed') {
        const originalSpeed = playerSpeed;
        setPlayerSpeed(item.statBoost.value);
        setTimeout(() => setPlayerSpeed(originalSpeed), item.statBoost.duration);
      }
      setInventory(prev => {
        const newInv = [...prev];
        if (newInv[index].quantity > 1) newInv[index].quantity--;
        else newInv.splice(index, 1);
        return newInv;
      });
    }

    if (type === 'action') {
      const { action } = payload;
      if (action.cost > 0) setCurrency(prev => prev - action.cost);
      if (action.item) {
        const item = action.item;
        setInventory(prev => {
          const idx = prev.findIndex(i => i.name === item.name);
          if (idx !== -1) {
            const newInv = [...prev];
            newInv[idx].quantity++;
            return newInv;
          } else {
            return [...prev, { ...item, quantity: 1 }];
          }
        });
      } else if (action.stat !== undefined && action.delta !== undefined) {
        setBarValues(prev =>
          prev.map((v, i) => i === action.stat ? Math.min(100, Math.max(0, v + action.delta)) : v)
        );
      } else if (action.sellItem && action.gain) {
        const itemIndex = inventory.findIndex(i => i.name === action.sellItem && i.quantity > 0);
        if (itemIndex !== -1) {
          setInventory(prev => {
            const newInv = [...prev];
            newInv[itemIndex].quantity--;
            if (newInv[itemIndex].quantity <= 0) newInv.splice(itemIndex, 1);
            return newInv;
          });
          setCurrency(prev => prev + action.gain);
        } else {
          alert(`You don't have any ${action.sellItem} to sell!`);
        }
      }
    }

    setActionInProgress(false);
    setLoadingText('');
    setPendingEffect(null);
  };

  const onUseItem = (item, index) => {
    if (actionInProgress) return;
    setActionInProgress(true);
    setLoadingText(`Using ${item.name}...`);
    keys.current = {};
    setPendingEffect({ type: 'item', payload: { item, index } });
    startCooldownTimer();
  };

  const performAction = (index, fromBuilding = false) => {
    if (!currentLocation || actionInProgress) return;
    const action = fromBuilding ? currentLocation.building?.actions[index] : currentLocation.actions[index];
    if (!action) return;
    const label = action.label || 'Performing action';

    if (action.special === 'bossBattle') {
      if (currency < (action.cost || 0)) {
        alert('Not enough currency to perform this action!');
        return;
      }

      setCurrency(prev => prev - action.cost);
      setActionInProgress(true);
      setLoadingText(`${label}...`);
      keys.current = {};
      setTimeout(() => {
        setInBossBattle(true);
        setActionInProgress(false);
        setLoadingText('');
      }, 5000);
      return;
    }

    if (currency < (action.cost || 0)) {
      alert('Not enough currency to perform this action!');
      return;
    }

    setActionInProgress(true);
    setLoadingText(`${label}...`);
    keys.current = {};
    setPendingEffect({ type: 'action', payload: { action } });
    startCooldownTimer();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
      if (cooldownEndTime && Date.now() >= cooldownEndTime) {
        setCooldownEndTime(null);
        applyPendingEffect();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [cooldownEndTime]);

  useEffect(() => {
    if (selectedShip) {
      localStorage.setItem('selectedCharacter', JSON.stringify({
        name: selectedShip.name,
        img: selectedShip.image,
      }));
    }
  }, [selectedShip]);

  useEffect(() => {
    const keyDownListener = (e) => { if (!actionInProgress) handleKeyDown(e, keys.current); };
    const keyUpListener = (e) => { if (!actionInProgress) handleKeyUp(e, keys.current); };
    window.addEventListener('keydown', keyDownListener);
    window.addEventListener('keyup', keyUpListener);
    let animationFrameId;
    const loop = () => {
      gameLoop({ keys: keys.current, playerPosRef, gameAreaRef, playerRef, currentLocation, setCurrentLocation, barValues, setBarValues, setGameOver, locations, setPendingLocation, playerSpeed });
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('keydown', keyDownListener);
      window.removeEventListener('keyup', keyUpListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, [barValues, currentLocation, actionInProgress, playerSpeed]);

  useEffect(() => {
    if (inBossBattle) return;
    const interval = setInterval(() => setBarValues(prev => prev.map(value => Math.max(0, value - 1))), 1000);
    return () => clearInterval(interval);
  }, [inBossBattle]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameTime(prev => {
        let minutes = prev.minutes + 1;
        let hours = prev.hours;
        if (minutes >= 60) {
          minutes = 0;
          hours = (hours + 1) % 24;
        }
        return { hours, minutes };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (barValues.some(value => value <= 0)) {
      setGameOver(true);
    }
  }, [barValues]);

  useEffect(() => {
    if (currency >= 100000) {
      setPhase("victoryDialogue");
    }
  }, [currency, setPhase]);

  const handleBossBattleEnd = (playerWon) => {
    setInBossBattle(false);
    if (playerWon) {
      setBossDefeated(true);
      setShowVictory(true);
      setCurrency(prev => prev + 500);
      setBarValues(prev => prev.map(val => Math.min(100, val + 50)));

      // ✅ FIXED: Now it transitions to the victory dialogue screen
      setTimeout(() => {
        setShowVictory(false);
        setPhase("victoryDialogue");
      }, 3000);
    } else {
      setBarValues([20, 20, 20, 20]);
    }
  };

  const restartGame = () => {
    playerPosRef.current = { x: 80, y: 50, rotation: 0 };
    setBarValues([50, 50, 50, 50]);
    setCurrency(150);
    setGameOver(false);
    setBossDefeated(false);
    setInventory([
      { name: 'Health Potion', quantity: 3, affectsBar: 0, increaseBy: 20 },
      { name: 'Energy Drink', quantity: 2, affectsBar: 1, increaseBy: 15 },
      { name: 'Turbo Snack', quantity: 10, statBoost: { type: 'speed', value: 5, duration: 10000 } }
    ]);
    setCooldownEndTime(null);
    setActionInProgress(false);
    setLoadingText('');
  };

  return (
    <div className="app">
      {inBossBattle ? (
        <FinalBoss onExit={handleBossBattleEnd} />
      ) : (
        <>
          <TopBar barValues={barValues} gameTime={gameTime} currency={currency} playerName={gameName} />
          <div className="main-wrapper">
            <GameArea ref={gameAreaRef} playerRef={playerRef} playerPosition={playerPosRef.current} currentLocation={currentLocation} />
            <RightPanel currentLocation={currentLocation} pendingLocation={pendingLocation} performAction={performAction} onTravel={() => setCurrentLocation(pendingLocation)} onTravelToMainMap={() => setCurrentLocation(null)} inventoryItems={inventory} onUseItem={onUseItem} keysState={keys.current} />
          </div>
          {gameOver && <GameOver onRestart={restartGame} />}
          {showVictory && (
            <div className="victory-screen">
              <div className="victory-message">
                YOU DEFEATED THE BOSS!
                <div className="victory-rewards">+500 Currency<br />+50 to All Stats</div>
              </div>
            </div>
          )}
        </>
      )}

      {actionInProgress && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner" />
            <p>{loadingText}</p>
            {cooldownEndTime && (
              <>
                <div className="cooldown-bar-container">
                  <div className="cooldown-bar" style={{ width: `${Math.min(100, 100 - ((cooldownEndTime - now) / 5000) * 100)}%` }} />
                </div>
                <p className="countdown-text">{Math.ceil((cooldownEndTime - now) / 1000)}s remaining</p>
              </>
            )}
            <button className="skip-button" onClick={() => { setCooldownEndTime(null); applyPendingEffect(); }}>Skip Wait</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
