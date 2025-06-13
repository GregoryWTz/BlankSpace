import React, { useEffect, useState } from "react";
import "./ShipSelector.css";

const ships = [
  { image: "/assets/ship1.png", name: "Ship 1" },
  { image: "/assets/ship2.png", name: "Ship 2" },
  { image: "/assets/ship3.png", name: "Ship 3" },
];

export default function ShipSelector({ selectedShip, setSelectedShip }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setSelectedShip(ships[currentIndex]);
  }, [currentIndex, setSelectedShip]);

  const handleLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + ships.length) % ships.length);
  };

  const handleRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ships.length);
  };

  return (
    <div className="ship-selector">
      <button className="arrow-button" onClick={handleLeft}>
        &#8592;
      </button>
      <div className="ship-display">
        <img src={ships[currentIndex].image} alt={ships[currentIndex].name} />
        <p className="ship-name">{ships[currentIndex].name}</p>
      </div>
      <button className="arrow-button" onClick={handleRight}>
        &#8594;
      </button>
    </div>
  );
}
