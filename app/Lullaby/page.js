"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, Languages, Clock, Upload } from "lucide-react";

// --- INITIAL DATA FOR LULLABIES ---
const initialLullabies = [
  {
    id: 1,
    title: "Twinkle Twinkle Little Star",
    artist: "Jane Doe",
    language: "English",
    audioSrc: "/TwinkleTwinkle.mp3",
    coverArt: "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
  },
  {
    id: 2,
    title: "Chanda Hai Tu",
    artist: "Traditional",
    language: "Hindi",
    audioSrc: "/chandaHaiTu.mp3",
    coverArt: "linear-gradient(to top, #d299c2 0% , #fe9d7 100%)",
  },
  {
    id: 3,
    title: "Lori Lori",
    artist: "Traditional",
    language: "Hindi",
    audioSrc: "/LoriLori.mp3",
    coverArt: "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
  },
  {
    id: 4,
    title: "Lakdi Ki Kathi",
    artist: "Traditional",
    language: "Hindi",
    audioSrc: "/LakdiKiKathi.mp3",
    coverArt: "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 5,
    title: "Baa Baa Black Sheep",
    artist: "Jane Doe",
    language: "English",
    audioSrc: "/babaBlackSheep.mp3",
    coverArt: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  },
];

// --- HELPER FUNCTIONS ---
const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const floorSeconds = Math.floor(seconds);
  const minutes = Math.floor(floorSeconds / 60);
  const remainingSeconds = floorSeconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

// --- MAIN COMPONENT ---
export default function LullabyPage() {
  const [allLullabies, setAllLullabies] = useState(initialLullabies);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [duration, setDuration] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [timerInput, setTimerInput] = useState("");
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const sleepTimeoutIdRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Filter lullabies based on language
  const filteredLullabies = useMemo(() => {
    if (selectedLanguage === "All") {
      return allLullabies;
    }
    return allLullabies.filter((lullaby) => lullaby.language === selectedLanguage);
  }, [selectedLanguage, allLullabies]);

  // sleep timer logic
  useEffect(() => {
    return () => {
      if (sleepTimeoutIdRef.current) clearTimeout(sleepTimeoutIdRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    setCurrentTrackIndex(0);
    setProgress(0);
    setIsPlaying(false);
  }, [selectedLanguage]);

  const currentTrack = filteredLullabies[currentTrackIndex];

  // Handlers for next and previous track
  const handleNext = useCallback(() => {
    if (filteredLullabies.length > 0) {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % filteredLullabies.length);
      setIsPlaying(true);
    }
  }, [filteredLullabies.length]);

  const handlePrev = useCallback(() => {
    if (filteredLullabies.length > 0) {
      setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + filteredLullabies.length) % filteredLullabies.length);
      setIsPlaying(true);
    }
  }, [filteredLullabies.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.volume = volume;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Playback error:", error);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTrackEnd = () => handleNext();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleTrackEnd);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, [handleNext]);

  const handlePlayPause = () => {
    if (filteredLullabies.length > 0) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
      setProgress(e.target.value);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTrackSelect = (index) => {
    const indexInFilteredList = filteredLullabies.findIndex((t) => t.id === filteredLullabies[index].id);
    setCurrentTrackIndex(indexInFilteredList);
    setIsPlaying(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newLullaby = {
        id: allLullabies.length + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Custom Upload",
        language: "Custom",
        audioSrc: URL.createObjectURL(file),
        coverArt: "linear-gradient(to top, #768995 0%, #92a3ad 100%)",
      };
      setAllLullabies((prev) => [...prev, newLullaby]);
      setSelectedLanguage("All");
      setCurrentTrackIndex(allLullabies.length);
      setIsPlaying(true);
    }
  };

  const handleSetTimer = () => {
    if (sleepTimeoutIdRef.current) clearTimeout(sleepTimeoutIdRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    const minutes = parseInt(timerInput, 10);
    if (!isNaN(minutes) && minutes > 0) {
      const totalSeconds = minutes * 60;
      setSleepTimerRemaining(totalSeconds);

      sleepTimeoutIdRef.current = setTimeout(() => {
        setIsPlaying(false);
        setTimerInput("");
        setSleepTimerRemaining(null);
        clearInterval(countdownIntervalRef.current);
      }, totalSeconds * 1000);

      countdownIntervalRef.current = setInterval(() => {
        setSleepTimerRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setTimerInput("");
      setSleepTimerRemaining(null);
    }
  };

  const handleTimerInputChange = (e) => {
    if (e.target.value === "" || parseInt(e.target.value, 10) >= 0) {
      setTimerInput(e.target.value);
    }
  };

  const languages = ["All", ...new Set(allLullabies.map((l) => l.language))];

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioSrc;

      if (isPlaying) {
        audioRef.current.load();
        audioRef.current.play().catch((e) => {
          if (e.name !== "AbortError") console.error("Error playing new track:", e);
        });
      }
    }
  }, [currentTrack, isPlaying]);

  if (!currentTrack) {
    return (
      <div className="bg-gray-50  min-h-screen flex flex-col items-center justify-center text-gray-700 p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-500 mb-2">Soothe & Sleep</h1>
          <p className="text-lg text-gray-500">No lullabies available for the selected language.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                selectedLanguage === lang ? "bg-pink-500 text-white shadow-lg" : "bg-white text-gray-600 hover:bg-pink-100"
              }`}>
              {lang}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <audio ref={audioRef} preload="metadata" />
      <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-700  rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col items-center text-center backdrop-blur-md bg-opacity-70">
          <div className="w-full max-w-sm h-64 md:h-80 rounded-2xl shadow-lg mb-6 transition-all duration-500" style={{ background: currentTrack.coverArt }}></div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{currentTrack.title}</h2>
          <p className="text-md text-gray-500 dark:text-gray-400 mb-6">{currentTrack.artist}</p>

          <div className="w-full max-w-md">
            <input type="range" min="0" max={duration || 0} value={progress} onChange={handleSeek} className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer range-sm" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 my-6">
            <button onClick={handlePrev} className="p-3 rounded-full text-gray-600 hover:bg-pink-100 transition-colors">
              <SkipBack size={24} />
            </button>
            <button onClick={handlePlayPause} className="p-5 rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105">
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button onClick={handleNext} className="p-3 rounded-full text-gray-600 hover:bg-pink-100 transition-colors">
              <SkipForward size={24} />
            </button>
          </div>

          <div className="w-full max-w-md space-y-4 pt-4 mt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <VolumeX size={20} className="text-gray-400" />
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer" />
              <Volume2 size={20} className="text-gray-400" />
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="sleep-timer-input" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock size={16} />
                Sleep Timer
              </label>
              <input
                id="sleep-timer-input"
                type="number"
                placeholder="Mins"
                value={timerInput}
                onChange={handleTimerInputChange}
                min="0"
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              />
              <button onClick={handleSetTimer} className="px-3 py-1.5 text-sm font-semibold text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors w-36 text-center">
                {sleepTimerRemaining !== null ? `Stop in ${formatTime(sleepTimerRemaining)}` : "Set Timer"}
              </button>
            </div>
          </div>
        </div>

        {/* Playlist Section */}
        <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-2xl p-6 flex flex-col backdrop-blur-md bg-opacity-70">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <ListMusic /> Playlist
            </h3>
            <div className="relative">
              <Languages className="text-gray-500" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                  selectedLanguage === lang ? "bg-pink-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-pink-100"
                }`}>
                {lang}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-grow -mr-2 pr-2 mb-4">
            {filteredLullabies.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handleTrackSelect(index)}
                className={`flex items-center gap-4  p-3 rounded-lg cursor-pointer transition-all duration-200 ${index === currentTrackIndex ? "bg-pink-100" : "hover:bg-gray-100"}`}>
                <div className="w-12 h-12 rounded-md flex-shrink-0" style={{ background: track.coverArt }}></div>
                <div className="flex-grow overflow-hidden">
                  <p className={`font-semibold truncate ${index === currentTrackIndex ? "text-pink-600" : "text-gray-700 dark:text-gray-200"}`}>{track.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 truncate">{track.artist}</p>
                </div>
                {index === currentTrackIndex && isPlaying && (
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></span>
                    <span className="w-1 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => fileInputRef.current.click()}
            className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors shadow-md">
            <Upload size={16} />
            Upload Your Own Lullaby
          </button>
        </div>
      </div>
    </div>
  );
}
