"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "./ui/Button";

const SpeechRecognition = ({ onTranscript, isListening, setIsListening, disabled = false }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setIsListening(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      let errorMessage = "Speech recognition failed";

      switch (event.error) {
        case "not-allowed":
          errorMessage = "Microphone access denied. Please allow microphone access.";
          break;
        case "no-speech":
          errorMessage = "No speech detected. Please try again.";
          break;
        case "network":
          errorMessage = "Network error. Try using Chrome/Edge browser or check your internet connection.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }

      setError(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = async () => {
    if (!isSupported || disabled) return;

    if (isListening) {
      stopRecognition();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        startRecognition();
      } catch (error) {
        if (error.name === "NotAllowedError") {
          setError("Microphone access denied. Please allow microphone access in your browser settings.");
        } else {
          setError("Failed to start speech recognition. Please try again.");
        }
        setIsListening(false);
      }
    }
  };

  if (!isSupported) {
    return (
      <Button variant="outline" size="icon" disabled className="text-gray-400 " title="Speech recognition not supported">
        <Mic className="w-4 h-4 dark:text-gray-100" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleListening}
        disabled={disabled}
        className={`transition-all duration-200 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 ${isListening ? "bg-red-500 text-white hover:bg-red-600 border-red-500 shadow-lg" : "hover:border-gray-300 dark:hover:border-gray-600"}`}
        title={isListening ? "Stop listening" : "Start listening"}>
        {isListening ? (
          <div className="relative">
            <MicOff className="w-4 h-4 animate-pulse text-white" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500  rounded-full animate-ping" />
          </div>
        ) : (
          <Mic className="w-4 h-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" />
        )}
      </Button>

      {isListening && <div className="absolute bottom-full mb-2 left-0 bg-green-100 text-green-700 text-xs px-2 py-1 rounded whitespace-nowrap animate-pulse">Listening...</div>}

      {showSuccess && <div className="absolute bottom-full mb-2 left-0 bg-green-100 text-green-700 text-xs px-2 py-1 rounded whitespace-nowrap">✓ Voice captured! Review and send.</div>}

      {error && <div className="absolute bottom-full mb-2 left-0 bg-red-100 text-red-700 text-xs px-2 py-1 rounded whitespace-nowrap max-w-xs">{error}</div>}
    </div>
  );
};

export default SpeechRecognition;
