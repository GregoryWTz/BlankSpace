import React, { useEffect } from "react";
import ShipSelector from "../../components/ShipSelector/ShipSelector";
import "./HomePage.css";

export default function HomePage({ name, setName, onStart, selectedShip, setSelectedShip }) {
  
  useEffect(() => {
    document.title = "Blank Space - Home";
  }, []);

  return (
    <div className="space-container">
      <h1 className="title-text">Blank Space</h1>

      <ShipSelector selectedShip={selectedShip} setSelectedShip={setSelectedShip} />

      <input
        type="text"
        className="name-input"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="start-button"
        onClick={onStart}
        disabled={!name || !selectedShip}
      >
        START
      </button>
    </div>
  );
}
