"use client";

import { Mic, MicOff } from "lucide-react";
import { Button } from "./ui/Button";
import { useState, useEffect } from "react";

const SpeechRecognitionFallback = ({ onTranscript, isListening, setIsListening, disabled = false }) => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  if (!isSupported) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="text-gray-400 cursor-not-allowed"
        title="Speech recognition not supported in this browser"
      >
        <Mic className="w-4 h-4" />
      </Button>
    );
  }

  return null;
};

export default SpeechRecognitionFallback; 