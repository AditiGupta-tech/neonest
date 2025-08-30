"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/Button";

const TextToSpeech = ({ text, disabled = false }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported("speechSynthesis" in window);

    // Load voices if available
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices are now loaded
      };
    }
  }, []);

  const speak = () => {
    if (!isSupported || !text || disabled) return;

    try {
      // Stop any current speech
      window.speechSynthesis.cancel();

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Configure speech settings
      utterance.lang = "en-US";
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to get a female voice for better user experience
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find((voice) => voice.lang.includes("en") && (voice.name.includes("female") || voice.name.includes("Female") || voice.name.includes("Samantha")));

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setError("");
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setError("Failed to play audio. Please try again.");
        setIsSpeaking(false);
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech synthesis error:", err);
      setError("Failed to play audio. Please try again.");
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak();
    }
  };

  if (!isSupported) {
    return (
      <Button variant="outline" size="icon" disabled className="text-gray-400" title="Text-to-speech not supported">
        <Volume2 className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSpeech}
        disabled={disabled || !text}
        className={`transition-all duration-200 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 ${
          isSpeaking ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500 shadow-lg" : "hover:border-gray-300 dark:hover:border-gray-600"
        }`}
        title={isSpeaking ? "Stop audio" : "Listen to AI response"}>
        {isSpeaking ? (
          <div className="relative">
            <VolumeX className="w-4 h-4 animate-pulse text-white" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </div>
        ) : (
          <Volume2 className="w-4 h-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" />
        )}
      </Button>

      {isSpeaking && <div className="absolute bottom-full mb-2 left-0 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded whitespace-nowrap animate-pulse">Playing audio...</div>}

      {error && <div className="absolute bottom-full mb-2 left-0 bg-red-100 text-red-700 text-xs px-2 py-1 rounded whitespace-nowrap max-w-xs">{error}</div>}
    </div>
  );
};

export default TextToSpeech;
