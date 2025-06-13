import { useState } from "react";
import HomePage from "./pages/HomePage/HomePage";
import DialogueBox from "./components/DialogueBox/DialogueBox";
import VictoryDialogueBox from "./components/DialogueBox/VictoryDialogueBox";
import Game from "./Game/Game";

export default function App() {
  const [name, setName] = useState("");
  const [selectedShip, setSelectedShip] = useState(null);
  const [phase, setPhase] = useState("home"); // 'home' | 'dialogue' | 'game' | 'victoryDialogue'

  const handleNameChange = (newName) => {
    setName(newName);
    localStorage.setItem("playerName", newName); // Save to localStorage for TopBar
  };

  const handleStart = () => {
    if (name) {
      localStorage.setItem("playerName", name); // Ensure it's saved
    }
    setPhase("dialogue");
  };

  return (
    <div>
      {phase === "home" && (
        <HomePage
          name={name}
          setName={handleNameChange}
          onStart={handleStart}
          selectedShip={selectedShip}
          setSelectedShip={setSelectedShip}
        />
      )}

      {phase === "dialogue" && (
        <DialogueBox
          playerName={name}
          onFinish={() => setPhase("game")}
        />
      )}

      {phase === "game" && (
        <Game
          gameName={name}
          selectedShip={selectedShip}
          setPhase={setPhase}
        />
      )}

      {phase === "victoryDialogue" && (
        <VictoryDialogueBox
          playerName={name}
          onFinish={() => alert("YOU WIN! Thanks for playing.")}
        />
      )}
    </div>
  );
}
