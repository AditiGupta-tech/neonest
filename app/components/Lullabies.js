"use client"

import { useState, useRef, useEffect } from "react";
import { Music, Upload, Trash2, Timer, X, Play, Pause, Volume2 } from "lucide-react";

export default function LullabyModal({ show, onClose }) {
  const [lullabies, setLullabies] = useState([
    { id: "1", title: "Twinkle Twinkle Little Star", src: "TwinkleTwinkle.mp3", isCustom: false },
    { id: "2", title: "Chanda Hai Tu", src: "chandaHaiTu.mp3", isCustom: false },
    { id: "3", title: "Lori Lori", src: "LoriLori.mp3", isCustom: false }
  ]);

  const [currentId, setCurrentId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [volume, setVolume] = useState(0.4); 
  const [uploading, setUploading] = useState(false); // ✅ New: uploading state
  const [uploadError, setUploadError] = useState(""); // ✅ New: error state

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer > 0 && audioRef.current && currentId !== null) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setCurrentId(null);
        }
        setTimer(0);
      }, timer * 60 * 1000);
    } else if (timerRef.current && (timer === 0 || currentId === null)) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [timer, currentId]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.onended = () => {
        setCurrentId(null);
        setTimer(0);
      };
    }
  }, [volume]);

  const playLullaby = (id, src) => {
    if (audioRef.current) {
      if (currentId && currentId !== id) {
        audioRef.current.pause();
      }
      audioRef.current.src = src;
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setCurrentId(id);
    }
  };

  const stopLullaby = () => {
    audioRef.current?.pause();
    setCurrentId(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
  };

  // ✅ Updated handleUpload with spinner, timeout, and error handling
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
        alert("Please upload a valid audio file.");
        return;
    }

    setUploading(true);
    setUploadError("");

    // Timeout in case upload takes too long (simulate slow network)
    const timeoutId = setTimeout(() => {
      setUploading(false);
      setUploadError("Upload timed out. Please try again.");
    }, 30000); // 30 seconds

    try {
      const url = URL.createObjectURL(file);
      const newLullaby = {
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        src: url,
        isCustom: true
      };
      setLullabies(prev => [...prev, newLullaby]);
      e.target.value = null;

      clearTimeout(timeoutId);
      setUploading(false);
    } catch (err) {
      clearTimeout(timeoutId);
      setUploading(false);
      setUploadError("Failed to upload. Please try again.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lullaby?")) {
      setLullabies(prev => prev.filter(l => l.id !== id));
      if (currentId === id) {
        stopLullaby();
      }
    }
  };

  const handleRename = (id, newTitle) => {
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle === "") {
      alert("Lullaby title cannot be empty!");
      return;
    }
    setLullabies(prev => prev.map(l => l.id === id ? { ...l, title: trimmedTitle } : l));
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-100 via-pink-100 to-rose-100 border border-pink-300 rounded-xl shadow-2xl p-6 w-full max-w-lg relative overflow-hidden transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-pink-500 hover:text-pink-700 transition-colors duration-200">
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3 mb-6 border-b pb-3 border-blue-200">
          <Music size={28} className="text-pink-500" /> Bedtime Lullabies
        </h2>
        <p className="text-gray-700 text-sm mb-6">
          Gently guide your little one to dreamland with soothing melodies. Pick from our calming collection or add your own cherished tunes!
        </p>

        <audio ref={audioRef} className="hidden" />

        {/* Lullabies List */}
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {lullabies.length === 0 && (
            <p className="text-center text-gray-500 italic py-4">No lullabies found. Let&apos;s add some magic!</p>
          )}
          {lullabies.map(lullaby => (
            <div key={lullaby.id} className="flex justify-between items-center p-3 border border-blue-200 rounded-lg shadow-sm bg-white hover:bg-blue-50 transition-colors duration-200">
              <input
                defaultValue={lullaby.title}
                className="flex-1 text-base font-medium text-gray-800 bg-transparent focus:outline-none focus:ring-1 focus:ring-pink-400 rounded px-1"
                onBlur={e => handleRename(lullaby.id, e.target.value)}
                title="Click to rename this lullaby"
              />
              <div className="flex items-center gap-2">
                {currentId === lullaby.id ? (
                  <button
                    onClick={stopLullaby}
                    className="p-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200"
                    title="Pause Lullaby"
                  >
                    <Pause size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => playLullaby(lullaby.id, lullaby.src)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
                    title="Play Lullaby"
                  >
                    <Play size={18} />
                  </button>
                )}
                {lullaby.isCustom && (
                  <button
                    onClick={() => handleDelete(lullaby.id)}
                    className="p-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-full transition-colors duration-200"
                    title="Delete Custom Lullaby"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="mt-6 border-t pt-4 border-blue-200">
          <label htmlFor="upload-audio" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-colors duration-200">
            <Upload size={20} /> Upload Your Own Soothing Sound
            <input id="upload-audio" type="file" accept="audio/*" className="hidden" onChange={handleUpload} />
          </label>
          <p className="text-xs text-gray-500 mt-1">
            (Formats: MP3, WAV, OGG. Keep it under 10MB for smooth playback.)
          </p>

          {/* ✅ New Upload Feedback */}
          {uploading && <p className="text-blue-600 mt-2">⏳ Uploading...</p>}
          {uploadError && (
            <div className="mt-2 text-red-600 flex items-center gap-2">
              <span>{uploadError}</span>
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setUploadError("")}
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Timer and Volume Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 border-t pt-4 border-blue-200">
          <div className="flex items-center gap-2">
            <Timer size={20} className="text-pink-500" />
            <label htmlFor="sleep-timer" className="text-sm font-medium text-gray-700 whitespace-nowrap">Set Sleep Timer:</label>
            <input
              id="sleep-timer"
              type="number"
              min="0"
              placeholder="0"
              value={timer}
              onChange={e => setTimer(Number(e.target.value))}
              className="border border-blue-300 p-2 rounded-md w-24 text-center focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
              title="Enter minutes for automatic playback stop (0 for endless play)"
            />
            <span className="text-sm text-gray-600">minutes</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Volume2 size={20} className="text-pink-500" />
            <label htmlFor="volume-control" className="text-sm font-medium text-gray-700 whitespace-nowrap">Adjust Volume:</label>
            <input
              id="volume-control"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer range-thumb-pink"
              title="Drag to change lullaby volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
