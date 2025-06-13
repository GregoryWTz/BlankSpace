import { maps } from './components/map';

export const handleKeyDown = (e, keys) => {
  const key = e.key.toLowerCase();
  keys[key] = true;
  if (e.key === 'ArrowUp') keys['w'] = true;
  if (e.key === 'ArrowDown') keys['s'] = true;
  if (e.key === 'ArrowLeft') keys['a'] = true;
  if (e.key === 'ArrowRight') keys['d'] = true;
};

export const handleKeyUp = (e, keys) => {
  const key = e.key.toLowerCase();
  keys[key] = false;
  if (e.key === 'ArrowUp') keys['w'] = false;
  if (e.key === 'ArrowDown') keys['s'] = false;
  if (e.key === 'ArrowLeft') keys['a'] = false;
  if (e.key === 'ArrowRight') keys['d'] = false;
};

export const gameLoop = ({
  keys,
  playerPosRef,
  gameAreaRef,
  playerRef,
  currentLocation,
  setCurrentLocation,
  barValues,
  setBarValues,
  setGameOver,
  locations,
  setPendingLocation,
  playerSpeed = 2
}) => {
  if (!gameAreaRef.current || !playerRef.current) return;

  const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
  const playerRect = playerRef.current.getBoundingClientRect();
  const speed = playerSpeed;

  let movingX = 0;
  let movingY = 0;

  if (keys['w'] && playerRect.top > gameAreaRect.top) {
    playerPosRef.current.y -= speed;
    movingY = -1;
  }
  if (keys['s'] && playerRect.bottom < gameAreaRect.bottom) {
    playerPosRef.current.y += speed;
    movingY = 1;
  }
  if (keys['a'] && playerRect.left > gameAreaRect.left) {
    playerPosRef.current.x -= speed;
    movingX = -1;
  }
  if (keys['d'] && playerRect.right < gameAreaRect.right) {
    playerPosRef.current.x += speed;
    movingX = 1;
  }

  if (movingX !== 0 || movingY !== 0) {
    const angle = Math.atan2(movingY, movingX) * (180 / Math.PI);
    playerPosRef.current.rotation = angle + 90;
  }

  playerRef.current.style.left = `${playerPosRef.current.x}px`;
  playerRef.current.style.top = `${playerPosRef.current.y}px`;

  let isNearBuilding = false;
  if (currentLocation) {
    const buildingElement = gameAreaRef.current.querySelector('.building');
    if (buildingElement) {
      const buildingRect = buildingElement.getBoundingClientRect();
      const playerCenter = {
        x: playerRect.left + playerRect.width / 2,
        y: playerRect.top + playerRect.height / 2
      };
      const buildingCenter = {
        x: buildingRect.left + buildingRect.width / 2,
        y: buildingRect.top + buildingRect.height / 2
      };
      const distance = Math.sqrt(
        Math.pow(playerCenter.x - buildingCenter.x, 2) +
        Math.pow(playerCenter.y - buildingCenter.y, 2)
      );
      if (distance < 100) {
        isNearBuilding = true;
      }
    }
  }

  if (currentLocation) {
    setPendingLocation(isNearBuilding ? currentLocation : null);
  }

  if (!currentLocation) {
    const planets = gameAreaRef.current.querySelectorAll('.circle-img');
    let isNearPlanet = false;

    planets.forEach(planet => {
      const planetRect = planet.getBoundingClientRect();
      const playerCenter = {
        x: playerRect.left + playerRect.width / 2,
        y: playerRect.top + playerRect.height / 2
      };
      const planetCenter = {
        x: planetRect.left + planetRect.width / 2,
        y: planetRect.top + planetRect.height / 2
      };
      const distance = Math.sqrt(
        Math.pow(playerCenter.x - planetCenter.x, 2) +
        Math.pow(playerCenter.y - planetCenter.y, 2)
      );
      const collisionRadius = (playerRect.width + planetRect.width) / 3;
      if (distance < collisionRadius) {
        planet.classList.add('wiggle');
        const location = locations.find(loc => loc.id === planet.id);
        if (location) {
          setPendingLocation(location);
          isNearPlanet = true;
        }
      } else {
        planet.classList.remove('wiggle');
      }
    });

    if (!isNearPlanet) {
      setPendingLocation(null);
    }
  }

  if (barValues.some(value => value <= 0)) {
    setGameOver(true);
  }
};

export const locations = maps.Default.planets.map(planet => ({
  id: planet.id,
  ...maps[planet.id]
}));
