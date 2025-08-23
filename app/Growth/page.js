// app/Growth/page.js - Complete updated version with persistent data and proper WHO references
"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, BarChart3, Pencil, Trash2, CalendarIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import Input from "../components/ui/Input";
import InteractionWithBaby from "../components/InteractionWithBaby";
import MilestoneTracker from "../components/MilestoneTracker";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth } from "../context/AuthContext";
import LoginPrompt from "../components/LoginPrompt";

// Import the fixed GrowthChart component
import GrowthChart from "./GrowthChart";

// Custom DatePicker Component
const DatePicker = ({ value, onChange, placeholder = "Select date" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const [viewYear, setViewYear] = useState(currentYear);
  const [viewMonth, setViewMonth] = useState(currentMonth);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return { year, month: month - 1, day };
  };

  const handleDateSelect = (day) => {
    const newDate = formatDate(viewYear, viewMonth, day);
    setSelectedDate(newDate);
    onChange(newDate);
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const days = getDaysInMonth(viewYear, viewMonth);
  const parsedSelectedDate = parseDate(selectedDate);
  const isSelectedMonth = parsedSelectedDate && parsedSelectedDate.year === viewYear && parsedSelectedDate.month === viewMonth;

  // Update selectedDate when value prop changes
  useEffect(() => {
    setSelectedDate(value || "");
  }, [value]);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer flex items-center justify-between bg-white"
      >
        <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
          {selectedDate || placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-gray-400" />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-lg shadow-lg p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-100 rounded"
              type="button"
            >
              ←
            </button>
            <div className="font-semibold">
              {monthNames[viewMonth]} {viewYear}
            </div>
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
              type="button"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="text-center">
                {day && (
                  <button
                    onClick={() => handleDateSelect(day)}
                    className={`w-8 h-8 text-sm rounded hover:bg-indigo-100 ${
                      isSelectedMonth && parsedSelectedDate.day === day
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-700'
                    }`}
                    type="button"
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t flex justify-between">
            <button
              onClick={() => {
                const todayStr = today.toISOString().split('T')[0];
                setSelectedDate(todayStr);
                onChange(todayStr);
                setIsOpen(false);
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
              type="button"
            >
              Today
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function GrowthPage() {
  const { isAuth } = useAuth();
  
  useEffect(() => {
    document.title = "Growth | NeoNest";
  }, []);

  const [growthLogs, setGrowthLogs] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: "",
    height: "",
    weight: "",
    head: "",
    comment: "",
  });
  const [editId, setEditId] = useState(null);
  const [babyDOB, setBabyDOB] = useState("");
  const [babyGender, setBabyGender] = useState("");
  const [showWHO, setShowWHO] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load data from localStorage on component mount (PERSISTENT DATA)
  useEffect(() => {
    const loadData = () => {
      try {
        // Load growth logs
        const savedLogs = localStorage.getItem("growthLogs");
        if (savedLogs) {
          const logs = JSON.parse(savedLogs);
          console.log("Loaded growth logs:", logs);
          setGrowthLogs(logs);
        }

        // Load baby DOB (PERSISTENT)
        const savedDOB = localStorage.getItem("babyDOB");
        if (savedDOB) {
          console.log("Loaded DOB:", savedDOB);
          setBabyDOB(savedDOB);
        }

        // Load baby gender (PERSISTENT)
        const savedGender = localStorage.getItem("babyGender");
        if (savedGender) {
          console.log("Loaded gender:", savedGender);
          setBabyGender(savedGender);
        }

        // Load WHO chart preference
        const savedWHO = localStorage.getItem("showWHO");
        if (savedWHO !== null) {
          setShowWHO(JSON.parse(savedWHO));
        }

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, []);

  // Save baby DOB to localStorage whenever it changes (PERSISTENT DATA)
  useEffect(() => {
    if (isDataLoaded && babyDOB) {
      console.log("Saving DOB:", babyDOB);
      localStorage.setItem("babyDOB", babyDOB);
    }
  }, [babyDOB, isDataLoaded]);

  // Save baby gender to localStorage whenever it changes (PERSISTENT DATA)
  useEffect(() => {
    if (isDataLoaded && babyGender) {
      console.log("Saving gender:", babyGender);
      localStorage.setItem("babyGender", babyGender);
    }
  }, [babyGender, isDataLoaded]);

  // Save WHO preference
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("showWHO", JSON.stringify(showWHO));
    }
  }, [showWHO, isDataLoaded]);

  // Helper function to calculate months since DOB
  const getMonthsSinceDOB = (dateStr) => {
    if (!babyDOB || !dateStr) return 0;
    const birthDate = new Date(babyDOB);
    const entryDate = new Date(dateStr);
    
    let months = (entryDate.getFullYear() - birthDate.getFullYear()) * 12 +
                 (entryDate.getMonth() - birthDate.getMonth());
    
    // Add fractional months based on day difference
    const dayDiff = entryDate.getDate() - birthDate.getDate();
    if (dayDiff > 0) {
      const daysInMonth = new Date(entryDate.getFullYear(), entryDate.getMonth() + 1, 0).getDate();
      months += dayDiff / daysInMonth;
    }
    
    return Math.max(0, months);
  };

  // PROPER WHO reference values with gender consideration for Bar Chart
  const getWHOHeightForBarChart = (dateStr, gender) => {
    const months = getMonthsSinceDOB(dateStr);
    
    // Male height reference data (50th percentile in cm)
    const maleHeightRef = {
      0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9, 5: 65.9, 6: 67.6,
      7: 69.2, 8: 70.6, 9: 72.0, 10: 73.3, 11: 74.5, 12: 75.7,
      13: 77.0, 14: 78.0, 15: 79.1, 16: 80.2, 17: 81.2, 18: 82.3,
      19: 83.2, 20: 84.2, 21: 85.1, 22: 86.0, 23: 86.9, 24: 87.8,
      30: 92.3, 36: 96.1
    };
    
    // Female height reference data (50th percentile in cm)
    const femaleHeightRef = {
      0: 49.1, 1: 53.7, 2: 57.1, 3: 59.8, 4: 62.1, 5: 64.0, 6: 65.7,
      7: 67.3, 8: 68.7, 9: 70.1, 10: 71.5, 11: 72.8, 12: 74.0,
      13: 75.2, 14: 76.4, 15: 77.5, 16: 78.6, 17: 79.7, 18: 80.7,
      19: 81.7, 20: 82.7, 21: 83.7, 22: 84.4, 23: 85.1, 24: 85.9,
      30: 90.3, 36: 94.1
    };
    
    const heightData = gender === "male" ? maleHeightRef : femaleHeightRef;
    
    // Find exact match
    const roundedMonths = Math.round(months);
    if (heightData[roundedMonths]) {
      return parseFloat(heightData[roundedMonths].toFixed(1));
    }
    
    // Linear interpolation between closest values
    const keys = Object.keys(heightData).map(Number).sort((a, b) => a - b);
    let lowerKey = keys.find(key => key <= months) || keys[0];
    let upperKey = keys.find(key => key > months) || keys[keys.length - 1];
    
    if (lowerKey === upperKey) {
      return parseFloat(heightData[lowerKey].toFixed(1));
    }
    
    const ratio = (months - lowerKey) / (upperKey - lowerKey);
    const interpolated = heightData[lowerKey] + ratio * (heightData[upperKey] - heightData[lowerKey]);
    
    return parseFloat(interpolated.toFixed(1));
  };

  const getWHOWeightForBarChart = (dateStr, gender) => {
    const months = getMonthsSinceDOB(dateStr);
    
    // Male weight reference data (50th percentile in kg)
    const maleWeightRef = {
      0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5, 6: 7.9,
      7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4, 12: 9.6,
      13: 9.9, 14: 10.1, 15: 10.3, 16: 10.5, 17: 10.7, 18: 11.0,
      19: 11.2, 20: 11.5, 21: 11.7, 22: 11.9, 23: 12.2, 24: 12.5,
      30: 13.3, 36: 14.2
    };
    
    // Female weight reference data (50th percentile in kg)
    const femaleWeightRef = {
      0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3,
      7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7, 12: 8.9,
      13: 9.2, 14: 9.4, 15: 9.6, 16: 9.8, 17: 10.0, 18: 10.2,
      19: 10.4, 20: 10.6, 21: 10.9, 22: 11.1, 23: 11.3, 24: 11.5,
      30: 12.7, 36: 13.9
    };
    
    const weightData = gender === "male" ? maleWeightRef : femaleWeightRef;
    
    // Find exact match
    const roundedMonths = Math.round(months);
    if (weightData[roundedMonths]) {
      return parseFloat(weightData[roundedMonths].toFixed(1));
    }
    
    // Linear interpolation between closest values
    const keys = Object.keys(weightData).map(Number).sort((a, b) => a - b);
    let lowerKey = keys.find(key => key <= months) || keys[0];
    let upperKey = keys.find(key => key > months) || keys[keys.length - 1];
    
    if (lowerKey === upperKey) {
      return parseFloat(weightData[lowerKey].toFixed(1));
    }
    
    const ratio = (months - lowerKey) / (upperKey - lowerKey);
    const interpolated = weightData[lowerKey] + ratio * (weightData[upperKey] - weightData[lowerKey]);
    
    return parseFloat(interpolated.toFixed(1));
  };

  // Function to save growth logs and notify other components
  const saveGrowthLogs = (updatedLogs) => {
    console.log("Saving growth logs:", updatedLogs);
    setGrowthLogs(updatedLogs);
    localStorage.setItem("growthLogs", JSON.stringify(updatedLogs));
    
    // Dispatch custom event to notify WHO Growth Chart
    window.dispatchEvent(new CustomEvent('growthDataUpdated', {
      detail: { logs: updatedLogs, dob: babyDOB, gender: babyGender }
    }));
  };

  // Add or update growth entry with PROPER WHO data
  const addGrowthEntry = () => {
    if (!newEntry.date || !newEntry.height || !newEntry.weight) {
      alert("Please fill in date, height, and weight");
      return;
    }
    
    const height = parseFloat(newEntry.height);
    const weight = parseFloat(newEntry.weight);
    const head = newEntry.head ? parseFloat(newEntry.head) : null;
    
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      alert("Please enter valid positive numbers for height and weight");
      return;
    }

    if (newEntry.head && (isNaN(head) || head <= 0)) {
      alert("Please enter a valid positive number for head circumference");
      return;
    }

    // Check if date is not in the future
    const entryDate = new Date(newEntry.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    
    if (entryDate > today) {
      alert("Entry date cannot be in the future");
      return;
    }

    // Check if date is not before baby's birth
    if (babyDOB) {
      const dobDate = new Date(babyDOB);
      if (entryDate < dobDate) {
        alert("Entry date cannot be before baby's birth date");
        return;
      }
    }
    
    // Use PROPER WHO data with gender consideration
    const entryWithWHO = {
      ...newEntry,
      height: height,
      weight: weight,
      head: head,
      whoHeight: getWHOHeightForBarChart(newEntry.date, babyGender),
      whoWeight: getWHOWeightForBarChart(newEntry.date, babyGender),
    };
    
    let updatedLogs;
    if (editId) {
      updatedLogs = growthLogs.map((log) => 
        log.id === editId ? { ...log, ...entryWithWHO } : log
      );
      setEditId(null);
    } else {
      // Check for duplicate dates
      const existingDateEntry = growthLogs.find(log => log.date === newEntry.date);
      if (existingDateEntry) {
        if (!confirm("An entry already exists for this date. Do you want to replace it?")) {
          return;
        }
        updatedLogs = growthLogs.map((log) => 
          log.date === newEntry.date ? { ...log, ...entryWithWHO } : log
        );
      } else {
        updatedLogs = [...growthLogs, { id: Date.now(), ...entryWithWHO }];
      }
    }
    
    // Sort by date to maintain chronological order
    updatedLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    saveGrowthLogs(updatedLogs);
    setNewEntry({ date: "", height: "", weight: "", head: "", comment: "" });
    
    // Show success message
    const action = editId ? "updated" : "added";
    console.log(`Growth entry ${action} successfully!`);
  };

  const deleteEntry = (id) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      const updatedLogs = growthLogs.filter((log) => log.id !== id);
      saveGrowthLogs(updatedLogs);
    }
  };

  const editEntry = (log) => {
    setNewEntry({
      date: log.date,
      height: log.height.toString(),
      weight: log.weight.toString(),
      head: log.head ? log.head.toString() : "",
      comment: log.comment || ""
    });
    setEditId(log.id);
    
    // Scroll to form
    setTimeout(() => {
      document.querySelector('h3').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cancelEdit = () => {
    setEditId(null);
    setNewEntry({ date: "", height: "", weight: "", head: "", comment: "" });
  };

  // Calculate baby's current age group for milestones
  const calculateBabyAge = () => {
    if (!babyDOB) return "";
    const dobDate = new Date(babyDOB);
    const now = new Date();
    const diffMonths = (now.getFullYear() - dobDate.getFullYear()) * 12 + (now.getMonth() - dobDate.getMonth());
    
    if (diffMonths < 1) return "0-1 month";
    if (diffMonths < 3) return "2-3 months";
    if (diffMonths < 6) return "4-6 months";
    if (diffMonths < 9) return "7-9 months";
    if (diffMonths < 12) return "10-12 months";
    return "12+ months";
  };

  // Calculate exact age in months and days
  const calculateExactAge = () => {
    if (!babyDOB) return "";
    const dobDate = new Date(babyDOB);
    const now = new Date();
    
    let months = (now.getFullYear() - dobDate.getFullYear()) * 12 + (now.getMonth() - dobDate.getMonth());
    let days = now.getDate() - dobDate.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months === 0) {
      return `${days} days old`;
    } else if (days === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} old`;
    } else {
      return `${months} ${months === 1 ? 'month' : 'months'} and ${days} ${days === 1 ? 'day' : 'days'} old`;
    }
  };

  // Milestone tracking (simplified version)
  const [checkedMilestones, setCheckedMilestones] = useState({});
  
  useEffect(() => {
    const savedMilestones = localStorage.getItem("checkedMilestones");
    if (savedMilestones) {
      setCheckedMilestones(JSON.parse(savedMilestones));
    }
  }, []);

  const toggleMilestone = (age, task) => {
    const key = `${age}:${task}`;
    const newCheckedMilestones = { ...checkedMilestones, [key]: !checkedMilestones[key] };
    setCheckedMilestones(newCheckedMilestones);
    localStorage.setItem("checkedMilestones", JSON.stringify(newCheckedMilestones));
  };

  const hasBadge = checkedMilestones["4-6 months:Rolls over"] && checkedMilestones["7-9 months:Sits without support"];

  // Show login prompt if user is not authenticated 

  if (!isAuth) {
    return <LoginPrompt sectionName="growth tracking" />;
  }
  

  // Show loading state
  if (!isDataLoaded) {
    return (
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center py-8">
          <div className="animate-pulse">Loading growth tracker...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Growth Tracker</h2>
        <p className="text-gray-600 mt-2">Log your baby's growth, track milestones, and visualize progress over time.</p>
      </div>

      {/* Baby Information Section - WITH PERSISTENT DATA */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Baby Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <DatePicker 
              placeholder="Select date of birth" 
              value={babyDOB} 
              onChange={(date) => setBabyDOB(date)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={babyGender}
              onChange={(e) => setBabyGender(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        {babyDOB && (
          <div className="bg-indigo-50 p-3 rounded-lg">
            <p className="text-sm text-indigo-800">
              <strong>Current Age:</strong> {calculateExactAge()}
              {babyGender && (
                <span className="ml-4">
                  <strong>Gender:</strong> {babyGender === "male" ? "Boy" : "Girl"}
                </span>
              )}
            </p>
            <p className="text-sm text-indigo-600 mt-1">
              <strong>Milestone Group:</strong> {calculateBabyAge()}
            </p>
          </div>
        )}
      </div>

      {/* Growth Entry Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-500" />
          {editId ? "Edit Growth Entry" : "Log New Growth Entry"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <DatePicker 
              placeholder="Select measurement date" 
              value={newEntry.date} 
              onChange={(date) => setNewEntry({ ...newEntry, date })} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm) *</label>
            <Input 
              placeholder="e.g., 65.5" 
              value={newEntry.height} 
              onChange={(e) => setNewEntry({ ...newEntry, height: e.target.value })}
              type="number"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
            <Input 
              placeholder="e.g., 7.2" 
              value={newEntry.weight} 
              onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
              type="number"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Head Circumference (cm)</label>
            <Input 
              placeholder="e.g., 42.0 (optional)" 
              value={newEntry.head} 
              onChange={(e) => setNewEntry({ ...newEntry, head: e.target.value })}
              type="number"
              step="0.1"
              min="0"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <Input 
              placeholder="Optional note about this measurement..." 
              value={newEntry.comment} 
              onChange={(e) => setNewEntry({ ...newEntry, comment: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="bg-indigo-500 hover:bg-indigo-600 text-white" 
            onClick={addGrowthEntry}
            disabled={!babyDOB || !babyGender}
          >
            <Plus className="w-4 h-4 mr-2" /> 
            {editId ? "Update Entry" : "Add Entry"}
          </Button>
          {editId && (
            <Button 
              className="bg-gray-500 hover:bg-gray-600 text-white" 
              onClick={cancelEdit}
            >
              Cancel Edit
            </Button>
          )}
        </div>
        
        {(!babyDOB || !babyGender) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Please enter baby's date of birth and gender first to enable growth tracking
            </p>
          </div>
        )}
      </div>

      {/* Growth Entries List */}
      {growthLogs.length > 0 ? (
        <>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Growth Log Entries ({growthLogs.length})
              </h3>
              <div className="text-sm text-gray-500">
                Most recent first
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...growthLogs].reverse().map((log, index) => {
                const months = getMonthsSinceDOB(log.date);
                return (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-medium text-gray-800">{log.date}</p>
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                            {months.toFixed(1)} months old
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            📏 <strong>{log.height} cm</strong>
                          </div>
                          <div className="flex items-center gap-1">
                            ⚖️ <strong>{log.weight} kg</strong>
                          </div>
                          {log.head && (
                            <div className="flex items-center gap-1">
                              🧠 <strong>{log.head} cm</strong>
                            </div>
                          )}
                        </div>
                        {showWHO && babyGender && (
                          <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-2">
                            <div>WHO Height Ref: {log.whoHeight} cm</div>
                            <div>WHO Weight Ref: {log.whoWeight} kg</div>
                          </div>
                        )}
                        {log.comment && (
                          <p className="text-sm italic text-gray-500 mt-2 bg-gray-100 p-2 rounded">
                            💭 "{log.comment}"
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 self-end sm:self-start">
                        <button
                          onClick={() => editEntry(log)}
                          className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-100"
                          title="Edit entry"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(log.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bar Chart for Recent Growth - WITH PROPER WHO DATA */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow overflow-x-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Growth Overview (Last 10 Entries)
              </h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showWHO}
                  onChange={(e) => setShowWHO(e.target.checked)}
                  className="rounded"
                />
                Show WHO Reference Standards
              </label>
            </div>
            
            <div className="min-w-[600px]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={growthLogs.slice(-10).map(log => ({
                    ...log,
                    shortDate: log.date.split('-').slice(1).join('/')
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="shortDate" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    label={{ value: "Height (cm)", angle: -90, position: "insideLeft" }}
                    fontSize={12}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Weight (kg)", angle: 90, position: "insideRight" }}
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name.includes('Height')) return [`${value} cm`, name];
                      if (name.includes('Weight')) return [`${value} kg`, name];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="height" fill="#ec4899" name="Baby's Height" />
                  {showWHO && <Bar yAxisId="left" dataKey="whoHeight" fill="#10b981" name="WHO Height Ref" />}
                  <Bar yAxisId="right" dataKey="weight" fill="#818cf8" name="Baby's Weight" />
                  {showWHO && <Bar yAxisId="right" dataKey="whoWeight" fill="#facc15" name="WHO Weight Ref" />}
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {showWHO && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📊 <strong>WHO Reference:</strong> The colored bars show World Health Organization growth standards 
                  (50th percentile) for {babyGender === "male" ? "boys" : "girls"} to help track your baby's growth progress.
                </p>
              </div>
            )}
          </div>

          {/* Growth Statistics */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📈 Growth Statistics
            </h3>
            {(() => {
              if (growthLogs.length < 2) return (
                <p className="text-gray-500">Add more entries to see growth statistics.</p>
              );
              
              const latestEntry = growthLogs[growthLogs.length - 1];
              const previousEntry = growthLogs[growthLogs.length - 2];
              const firstEntry = growthLogs[0];
              
              const heightGrowth = (latestEntry.height - previousEntry.height).toFixed(1);
              const weightGain = (latestEntry.weight - previousEntry.weight).toFixed(1);
              const totalHeightGrowth = (latestEntry.height - firstEntry.height).toFixed(1);
              const totalWeightGain = (latestEntry.weight - firstEntry.weight).toFixed(1);
              
              const daysBetween = Math.abs(new Date(latestEntry.date) - new Date(previousEntry.date)) / (1000 * 60 * 60 * 24);
              const totalDays = Math.abs(new Date(latestEntry.date) - new Date(firstEntry.date)) / (1000 * 60 * 60 * 24);
              
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Recent Changes</h4>
                    <p className="text-sm text-green-700">
                      Height: {heightGrowth > 0 ? '+' : ''}{heightGrowth} cm<br/>
                      Weight: {weightGain > 0 ? '+' : ''}{weightGain} kg<br/>
                      <span className="text-xs">Over {Math.round(daysBetween)} days</span>
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Total Growth</h4>
                    <p className="text-sm text-blue-700">
                      Height: +{totalHeightGrowth} cm<br/>
                      Weight: +{totalWeightGain} kg<br/>
                      <span className="text-xs">Over {Math.round(totalDays)} days</span>
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Growth Entries Yet</h3>
          <p className="text-gray-500 mb-4">Start logging your baby's measurements to unlock growth charts and insights!</p>
          {(!babyDOB || !babyGender) && (
            <p className="text-sm text-yellow-600 bg-yellow-100 inline-block px-4 py-2 rounded-lg">
              📝 Please fill in baby information above first
            </p>
          )}
        </div>
      )}

      {/* WHO Growth Standards Chart - UPDATED TO USE REAL DATA */}
      {babyDOB && babyGender && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🌍 WHO Growth Standards Chart
          </h3>
          <GrowthChart 
            defaultMonths={24}
            babyData={growthLogs}
            babyDOB={babyDOB}
            babyGender={babyGender}
          />
        </div>
      )}

      {/* Quick Tips */}
      {growthLogs.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
            💡 Growth Tracking Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-purple-700">
            <div className="flex items-start gap-2">
              <span>📏</span>
              <span>Measure at the same time of day for consistency</span>
            </div>
            <div className="flex items-start gap-2">
              <span>⚖️</span>
              <span>Weigh before feeding for accurate results</span>
            </div>
            <div className="flex items-start gap-2">
              <span>📅</span>
              <span>Track weekly for infants, bi-weekly for toddlers</span>
            </div>
            <div className="flex items-start gap-2">
              <span>👩‍⚕️</span>
              <span>Consult your pediatrician about growth patterns</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Developmental Milestones</h3>
        <MilestoneTracker babyDOB={babyDOB} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <InteractionWithBaby />
      </div>
</div>
      {hasBadge && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
          🏆 Congratulations! Your baby unlocked the <strong>Milestone Badge</strong> for "Rolling over" and "Sitting without support"!
        </div>
      )}

      <div className="text-center text-gray-500 text-sm py-8 ">
        For more information regarding this section, visit{" "}
        <a href="/Resources" className="text-pink-600 hover:underline">Resources</a> or{" "}
        <a href="/Faqs" className="text-pink-600 hover:underline">FAQs</a>.
      </div>
    </div>
  );
}