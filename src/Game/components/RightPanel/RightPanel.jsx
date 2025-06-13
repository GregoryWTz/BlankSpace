import React, { useState } from 'react';
import './RightPanel.css';

const RightPanel = ({
  currentLocation,
  pendingLocation,
  performAction,
  onTravel,
  onTravelToMainMap,
  inventoryItems,
  onUseItem,
  keysState,
}) => {

  const [inventoryOpen, setInventoryOpen] = useState(false);

  const toggleInventory = () => {
    setInventoryOpen(!inventoryOpen);
  };

  if (inventoryOpen) {
    return (
      <div className="right-panel" id="rightPanel">
        <div className="inventory-header">
          Inventory
          <button 
            className="close-inventory-btn"
            onClick={toggleInventory}
            aria-label="Close Inventory"
          >
            ✕
          </button>
        </div>
        <div className="inventory-list">
          {inventoryItems.length === 0 && <div>Your inventory is empty.</div>}
          {inventoryItems.map((item, index) => (
            <div
              key={index}
              className="inventory-item"
              onClick={() => onUseItem(item, index)}
            >
              {item.name} (x{item.quantity})
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="right-panel" id="rightPanel">
      <div className="location-header">
        <strong id="locationTitle">
          {currentLocation
            ? `You're at Planet ${currentLocation.id}`
            : 'Start Your Adventure!!!'}
        </strong>
      </div>

      <button className="inventory-toggle-btn" onClick={toggleInventory}>
        Open Inventory
      </button>

      {pendingLocation && !currentLocation && (
        <div className="travel-button-wrapper">
          <button onClick={onTravel} className="travel-button">
            Travel to {pendingLocation.id}
          </button>
        </div>
      )}

      {currentLocation && (
        <div 
          className="button"
          onClick={onTravelToMainMap}
          style={{ marginTop: '10px' }}
        >
          Return to Main Map
        </div>
      )}

      {currentLocation && pendingLocation && pendingLocation.id === currentLocation.id && pendingLocation.building && (
        <>
          <div className="location-header">
            Building: {pendingLocation.building.name}
          </div>
          <div className="action-buttons">
            {pendingLocation.building.actions?.map((action, index) => (
              <div
                key={index}
                className="button"
                onClick={() => performAction(index, true)}
              >
                {action.label}
              </div>
            ))}
          </div>
        </>
      )}

<div className="controls">
  <div></div>
  <button
    className="key-button"
    onMouseDown={() => keysState['w'] = true}
    onMouseUp={() => keysState['w'] = false}
    onTouchStart={() => keysState['w'] = true}
    onTouchEnd={() => keysState['w'] = false}
  >
    W
  </button>
  <div></div>

  <button
    className="key-button"
    onMouseDown={() => keysState['a'] = true}
    onMouseUp={() => keysState['a'] = false}
    onTouchStart={() => keysState['a'] = true}
    onTouchEnd={() => keysState['a'] = false}
  >
    A
  </button>
  <div></div>
  <button
    className="key-button"
    onMouseDown={() => keysState['d'] = true}
    onMouseUp={() => keysState['d'] = false}
    onTouchStart={() => keysState['d'] = true}
    onTouchEnd={() => keysState['d'] = false}
  >
    D
  </button>

  <div></div>
  <button
    className="key-button"
    onMouseDown={() => keysState['s'] = true}
    onMouseUp={() => keysState['s'] = false}
    onTouchStart={() => keysState['s'] = true}
    onTouchEnd={() => keysState['s'] = false}
  >
    S
  </button>
  <div></div>
</div>

    </div>
  );
};

export default RightPanel;
