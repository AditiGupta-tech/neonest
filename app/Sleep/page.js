"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Clock,
  Moon,
  Edit,
  Trash2,
  Calendar,
  Save,
} from "lucide-react";
import Input from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Sleeptips from "../components/Sleeptips";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";

export default function Page() {
  const { isAuth, token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSchedule, setNewSchedule] = useState({
    time: "",
    type: "nap",
    duration: "",
    mood: "",
    notes: "",
  });

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    document.title = "Sleep | NeoNest";
    if (isAuth) {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/sleep", { headers });
        setSchedules(res.data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    }
  }, [isAuth]);

  const addSchedule = async () => {
    if (!newSchedule.time || !newSchedule.duration) return;
    const item = {
      ...newSchedule,
      date: new Date().toISOString().split("T")[0],
      babyName: "YourBaby",
    };
    try {
      const res = await axios.post("/api/sleep", item, { headers });
      setSchedules([...schedules, res.data]);
      resetForm();
    } catch (err) {
      console.error("Failed to add:", err);
    }
  };

  const updateSchedule = async (id, updated) => {
    try {
      const res = await axios.patch(`/api/sleep/${id}`, updated, { headers });
      setSchedules(schedules.map((s) => (s._id === id ? res.data : s)));
      setEditingSchedule(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await axios.delete(`/api/sleep/${id}`, { headers });
      setSchedules(schedules.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const resetForm = () => {
    setNewSchedule({
      time: "",
      type: "nap",
      duration: "",
      mood: "",
      notes: "",
    });
    setIsAddingSchedule(false);
    setEditingSchedule(null);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "nap":
        return "bg-yellow-100 text-yellow-800";
      case "night":
        return "bg-indigo-200 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const moodEmoji = (mood) => {
    const map = {
      happy: "😊",
      cranky: "😠",
      sleepy: "😴",
      playful: "😄",
    };
    return map[mood] || "";
  };

  const today = new Date().toISOString().split("T")[0];
  const todaySchedules = schedules
    .filter((s) => s.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Show login prompt if user is not authenticated
  if (!isAuth) {
    return <LoginPrompt sectionName="sleep tracking" />;
  }

  if (loading) {
    return (
      <div className="text-center text-gray-500 p-8">Loading sleep logs...</div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Sleep: Tips & Routine
          </h2>
          <p className="text-gray-600">
            Track your baby’s naps, nighttime sleep, and moods after rest.
          </p>
        </div>
        <Button
          onClick={() => setIsAddingSchedule(true)}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Sleep Log
        </Button>
      </div>

      {(isAddingSchedule || editingSchedule) && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 mt-3 mb-10">
            <Moon className="w-5 h-5 text-indigo-400" />
            {editingSchedule ? "Edit Sleep Log" : "Add New Sleep Entry"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <Input
                type="time"
                value={editingSchedule ? editingSchedule.time : newSchedule.time}
                onChange={(e) => {
                  const value = e.target.value;
                  editingSchedule
                    ? setEditingSchedule({
                        ...editingSchedule,
                        time: value,
                      })
                    : setNewSchedule({ ...newSchedule, time: value });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sleep Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={
                  editingSchedule ? editingSchedule.type : newSchedule.type
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editingSchedule
                    ? setEditingSchedule({
                        ...editingSchedule,
                        type: value,
                      })
                    : setNewSchedule({ ...newSchedule, type: value });
                }}
              >
                <option value="nap">Nap</option>
                <option value="night">Night Sleep</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Input
                placeholder="e.g., 45 mins, 2 hrs"
                value={
                  editingSchedule
                    ? editingSchedule.duration
                    : newSchedule.duration
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editingSchedule
                    ? setEditingSchedule({
                        ...editingSchedule,
                        duration: value,
                      })
                    : setNewSchedule({ ...newSchedule, duration: value });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Mood After Sleep
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={
                  editingSchedule ? editingSchedule.mood : newSchedule.mood
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editingSchedule
                    ? setEditingSchedule({
                        ...editingSchedule,
                        mood: value,
                      })
                    : setNewSchedule({ ...newSchedule, mood: value });
                }}
              >
                <option value="">Select Mood</option>
                <option value="happy">Happy 😊</option>
                <option value="sleepy">Still Sleepy 😴</option>
                <option value="cranky">Cranky 😠</option>
                <option value="playful">Playful 😄</option>
              </select>
            </div>

            <div className="col-span-full">
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Input
                placeholder="Optional notes..."
                value={
                  editingSchedule ? editingSchedule.notes : newSchedule.notes
                }
                onChange={(e) => {
                  const value = e.target.value;
                  editingSchedule
                    ? setEditingSchedule({
                        ...editingSchedule,
                        notes: value,
                      })
                    : setNewSchedule({ ...newSchedule, notes: value });
                }}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={
                editingSchedule
                  ? () => updateSchedule(editingSchedule._id, editingSchedule)
                  : addSchedule
              }
              className="bg-gradient-to-r from-indigo-500 to-violet-500"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingSchedule ? "Update" : "Add"} Sleep Log
            </Button>
            <Button onClick={resetForm} className="border border-gray-300">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Today's Logs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Today's Sleep Schedule
          <Badge>{todaySchedules.length} entries</Badge>
        </h3>

        {todaySchedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Moon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No sleep entries for today</p>
            <Button
              onClick={() => setIsAddingSchedule(true)}
              className="mt-4 border border-gray-300 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Add First Sleep Log
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySchedules.map((s) => (
              <div
                key={s._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{s.time}</span>
                  </div>
                  <Badge className={getTypeColor(s.type)}>
                    <Moon className="w-3 h-3 mr-1" />
                    {s.type === "nap" ? "Nap" : "Night"}
                  </Badge>
                  {s.duration && (
                    <span className="text-sm text-gray-600">{s.duration}</span>
                  )}
                  {s.mood && (
                    <span className="text-sm text-gray-500 italic">
                      {moodEmoji(s.mood)} {s.mood}
                    </span>
                  )}
                  {s.notes && (
                    <span className="text-sm text-gray-400 italic">
                      "{s.notes}"
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingSchedule(s)}
                    className="text-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteSchedule(s._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Previous Logs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Previous Sleep Logs
          <Badge>{schedules.length} total</Badge>
        </h3>

        {schedules.filter((s) => s.date !== today).length === 0 ? (
          <p className="text-center text-gray-500">No past sleep logs found.</p>
        ) : (
          <div className="space-y-3">
            {schedules
              .filter((s) => s.date !== today)
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((s) => (
                <div
                  key={s._id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{s.date.split('T')[0]}</span>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{s.time}</span>
                    </div>
                    <Badge className={getTypeColor(s.type)}>
                      <Moon className="w-3 h-3 mr-1" />
                      {s.type === "nap" ? "Nap" : "Night"}
                    </Badge>
                    {s.duration && (
                      <span className="text-sm text-gray-600">{s.duration}</span>
                    )}
                    {s.mood && (
                      <span className="text-sm text-gray-500 italic">
                        {moodEmoji(s.mood)} {s.mood}
                      </span>
                    )}
                    {s.notes && (
                      <span className="text-sm text-gray-400 italic">
                        "{s.notes}"
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingSchedule(s)}
                      className="text-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteSchedule(s._id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <Sleeptips/>
    </div>
  );
}
