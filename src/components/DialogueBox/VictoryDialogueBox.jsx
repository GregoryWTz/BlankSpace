import { useState, useEffect } from "react";
import "./DialogueBox.css";

export default function VictoryDialogueBox({ playerName, onFinish }) {
  const [index, setIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    document.title = "Starship Adventure - Victory";
  }, []);

  const dialogues = [
    `Congratulations, ${playerName || "Traveler"}!`,
    "You have defeated the GREAT THREAT.",
    "The galaxy is safe once more.",
    "You are a legend among the stars.",
    "Until the next adventure...",
  ];

  useEffect(() => {
    if (!showCredits) {
      setVisibleText("");
      setCharIndex(0);
      setIsTyping(false);
      setTimeout(() => setIsTyping(true), 10);
    }
  }, [index, showCredits]);

  useEffect(() => {
    if (charIndex < dialogues[index]?.length) {
      const timeout = setTimeout(() => {
        setVisibleText((prev) => prev + dialogues[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [charIndex, index]);

  const handleNext = () => {
    const isLast = index === dialogues.length - 1;

    if (charIndex < dialogues[index].length) {
      setVisibleText(dialogues[index]);
      setCharIndex(dialogues[index].length);
      setIsTyping(false);
    } else if (isLast) {
      // Show credits directly
      setShowCredits(true);

      // Optional: auto-finish after credits scroll (20s)
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 20000);
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="scene-container">
      {!showCredits ? (
        <div className="dialogue-group">
          <img
            src="/assets/tiny.png"
            alt="Character"
            className={`character-image ${isTyping ? "shake" : ""}`}
          />
          <div className="dialogue-box">
            <div className="dialogue-text">{visibleText}</div>
            <button onClick={handleNext}>
              {charIndex < dialogues[index].length
                ? "..."
                : index === dialogues.length - 1
                ? "THE END"
                : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="credits-screen">
          <div className="credits-content">
            <h1>Black Space</h1>
            <p>Directed by: Gregorius William Tanuwijaya</p>
            <p>Game Design: Daniel Kurnia Gunawan</p>
            <p>Programming: Nicholas Dharma Tan</p>
            <p>Story & Dialogue: Gregorius William Tanuwijaya</p>
            <p>Art: Daniel Kurnia Gunawan</p>
            <p>Special Thanks: All Players</p>
            <p>Thank you for playing!</p>
          </div>
        </div>
      )}
    </div>
  );
}
