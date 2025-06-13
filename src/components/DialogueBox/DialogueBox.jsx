import { useState, useEffect } from "react";
import "./DialogueBox.css";

export default function DialogueBox({ playerName, onFinish }) {

  useEffect(() => {
    document.title = "Blank Space - Dialogue";
  }, []);
  
  const dialogues = [
    `Hello ${playerName || "Traveler"}, welcome aboard!`,
    "Glad you could make it.",
    "Collect as much money as possible to defeat the GREAT THREAT!",
    "We prepare some supplies for your journey",
    "It may not be enough so make sure to check other planets to restock.",
    "Why do we need to kill the GREAT THREAT?",
    "Skill Issue lol, NOW GO!!!"
  ];

  const [index, setIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setVisibleText("");
    setCharIndex(0);
    setIsTyping(false); 
    setTimeout(() => setIsTyping(true), 10);
  }, [index]);

  useEffect(() => {
    if (charIndex < dialogues[index].length) {
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
      if (onFinish) onFinish();
    } else {
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="scene-container">
      <div className="dialogue-group">
        <img
          src="/assets/tiny.png"
          alt="Character"
          className={`character-image ${isTyping ? "shake" : ""}`}
          key={isTyping ? "shaking" : "still"}
        />
        <div className="dialogue-box">
          <div className="dialogue-text">{visibleText}</div>
          <button onClick={handleNext}>
            {charIndex < dialogues[index].length ? "..." : index === dialogues.length - 1 ? "Start" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
