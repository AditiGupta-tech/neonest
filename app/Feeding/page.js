"use client";

import { useState, useEffect } from "react";
import { Plus, Clock, Utensils, Baby, Edit, Trash2, Calendar, Save } from "lucide-react";
import Input from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Feedingtips from "../components/Feedingtips";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Page() {
  useEffect(() => {
    document.title = "Feeding | NeoNest";
  }, []);

  const router = useRouter();
  const { isAuth, token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    time: "",
    type: "Breastfeeding",
    amount: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuth) {
      router.push("/Login");
    }
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get("/api/feeding", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchedules(res.data.feed || []);
      } catch (err) {
        console.error("Error fetching feeds:", err);
      }
    };

    fetchSchedules();
  }, []);

  const handleAddSchedule = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding`,
        newSchedule,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data)
      if (res.data.feed) {
        setSchedules((prev) => [...prev, res.data.feed]);
      }
      setNewSchedule({ time: "", type: "Breastfeeding", amount: "", notes: "" });
      setIsAddingSchedule(false);
    } catch (err) {
      console.error("Error adding feed:", err);
    }
  };

  const handleUpdateSchedule = async (id, updatedData) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding`,
        { feedId: id, ...updatedData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedules((prev) => prev.map((s) => (s._id === id ? { ...s, ...updatedData } : s)));
      setEditingSchedule(null);
    } catch (err) {
      console.error("Error updating feed:", err);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feeding`, {
        params: { feedId: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSchedules((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting feed:", err);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Breastfeeding":
        return Baby;
      case "Bottle":
      case "Solid Food":
        return Utensils;
      default:
        return Utensils;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Breastfeeding":
        return "bg-gradient-to-r from-pink-400 to-pink-600 text-white";
      case "Bottle":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case "Solid Food":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    }
  };

  const getTypeBorderColor = (type) => {
    switch (type) {
      case "Breastfeeding":
        return "border-pink-200 hover:from-pink-50 hover:to-purple-50";
      case "Bottle":
        return "border-blue-200 hover:from-blue-50 hover:to-purple-50";
      case "Solid Food":
        return "border-green-200 hover:from-green-50 hover:to-purple-50";
      default:
        return "border-gray-200 hover:from-gray-50 hover:to-purple-50";
    }
  };

  const todaySchedules = schedules;

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen relative overflow-x-hidden">
      {/* Particle Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-30"></div>
      </div>

      <div className="container mx-auto space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6 relative z-10">
        {/* Header Section - Enhanced Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight relative">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Feeding: Tips and Schedule
              </span>
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              Track your baby's feeding times and learn best practices with our intuitive interface.
            </p>
          </div>
          <Button
            onClick={() => setIsAddingSchedule(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white w-full sm:w-auto min-h-[44px] sm:min-h-[40px] text-sm sm:text-base px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-bounce-gentle" />
            Add Feeding
          </Button>
        </div>

        {/* Form Section - Enhanced Responsive */}
        {(isAddingSchedule || editingSchedule) && (
          <div className="bg-white/90 backdrop-blur-md border border-pink-200 rounded-2xl p-4 sm:p-6 shadow-xl animate-slide-up">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold flex items-center gap-2 mb-6 sm:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center animate-glow">
                <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {editingSchedule ? "Edit Feeding" : "Add New Feeding"}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 group">
                <label className="block text-sm font-medium mb-2 text-gray-700 group-hover:text-pink-600 transition-colors duration-300">Time</label>
                <Input
                  type="time"
                  value={editingSchedule ? editingSchedule.time : newSchedule.time}
                  onChange={(e) =>
                    editingSchedule
                      ? setEditingSchedule({ ...editingSchedule, time: e.target.value })
                      : setNewSchedule({ ...newSchedule, time: e.target.value })
                  }
                  className="min-h-[44px] sm:min-h-[40px] rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-medium mb-2 text-gray-700 group-hover:text-pink-600 transition-colors duration-300">Type</label>
                <select
                  className="w-full p-3 sm:p-2 border border-gray-300 rounded-xl min-h-[44px] sm:min-h-[40px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm"
                  value={editingSchedule ? editingSchedule.type : newSchedule.type}
                  onChange={(e) =>
                    editingSchedule
                      ? setEditingSchedule({ ...editingSchedule, type: e.target.value })
                      : setNewSchedule({ ...newSchedule, type: e.target.value })
                  }
                >
                  <option value="Breastfeeding">Breastfeeding</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Solid Food">Solid Food</option>
                </select>
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-medium mb-2 text-gray-700 group-hover:text-pink-600 transition-colors duration-300">Amount</label>
                <Input
                  placeholder="e.g., 4 oz, 30 min, 1/2 cup"
                  value={editingSchedule ? editingSchedule.amount : newSchedule.amount}
                  onChange={(e) =>
                    editingSchedule
                      ? setEditingSchedule({ ...editingSchedule, amount: e.target.value })
                      : setNewSchedule({ ...newSchedule, amount: e.target.value })
                  }
                  className="min-h-[44px] sm:min-h-[40px] rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2 group">
                <label className="block text-sm font-medium mb-2 text-gray-700 group-hover:text-pink-600 transition-colors duration-300">Notes</label>
                <Input
                  placeholder="Optional notes"
                  value={editingSchedule ? editingSchedule.notes : newSchedule.notes}
                  onChange={(e) =>
                    editingSchedule
                      ? setEditingSchedule({ ...editingSchedule, notes: e.target.value })
                      : setNewSchedule({ ...newSchedule, notes: e.target.value })
                  }
                  className="min-h-[44px] sm:min-h-[40px] rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Button
                onClick={() =>
                  editingSchedule
                    ? handleUpdateSchedule(editingSchedule._id, editingSchedule)
                    : handleAddSchedule()
                }
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md order-1 sm:order-none"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {editingSchedule ? "Update" : "Add"} Feeding
              </Button>
              <Button
                onClick={() => {
                  setIsAddingSchedule(false);
                  setEditingSchedule(null);
                  setNewSchedule({ time: "", type: "Breastfeeding", amount: "", notes: "" });
                }}
                className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base px-6 py-3 rounded-xl font-medium transition-all duration-300 order-2 sm:order-none hover:border-pink-400 hover:text-pink-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Feeding Schedule Section - Enhanced Responsive */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-pink-200 p-4 sm:p-6 shadow-xl animate-slide-up">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center animate-glow">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Today's Feeding Schedule</span>
            </div>
            <Badge className="w-fit bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg animate-pulse">
              {todaySchedules.length} feedings
            </Badge>
          </h3>

          {todaySchedules.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center animate-pulse">
                <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <p className="text-sm sm:text-base mb-4">No feedings scheduled for today</p>
              <Button
                onClick={() => setIsAddingSchedule(true)}
                className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 min-h-[44px] sm:min-h-[40px] text-sm sm:text-base px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:border-pink-400 hover:text-pink-700"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add First Feeding
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {todaySchedules.map((s) => {
                if (!s || !s.type) return null;
                const Icon = getTypeIcon(s.type);
                return (
                  <div
                    key={s._id}
                    className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-5 border rounded-xl gap-3 sm:gap-4 card-hover bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getTypeBorderColor(s.type)}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-sm sm:text-base text-gray-800">{s.time}</span>
                      </div>
                      <Badge className={`${getTypeColor(s.type)} w-fit flex-shrink-0 shadow-md`}>
                        <Icon className="w-3 h-3 mr-1" />
                        <span className="text-xs sm:text-sm">
                          {s.type.charAt(0).toUpperCase() + s.type.slice(1)}
                        </span>
                      </Badge>
                      {s.amount && (
                        <span className="text-xs sm:text-sm text-gray-600 break-words bg-gray-100 px-2 py-1 rounded-lg">
                          {s.amount}
                        </span>
                      )}
                      {s.notes && (
                        <span className="text-xs sm:text-sm text-gray-500 italic break-words bg-pink-50 px-2 py-1 rounded-lg">
                          "{s.notes}"
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 sm:gap-3 self-end sm:self-auto">
                      <Button 
                        onClick={() => setEditingSchedule(s)} 
                        className="text-sm min-h-[44px] sm:min-h-[40px] px-3 sm:px-4 py-2 border border-pink-300 rounded-lg hover:bg-pink-50 transition-all duration-300 hover:border-pink-400 hover:scale-105"
                      >
                        <Edit className="w-4 h-4 text-pink-600" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSchedule(s._id)}
                        className="text-red-500 hover:text-red-700 text-sm min-h-[44px] sm:min-h-[40px] px-3 sm:px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-300 hover:border-red-400 hover:scale-105"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Feedingtips />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(236, 72, 153, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.8);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-bounce-gentle {
          animation: bounceGentle 2s infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .card-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .card-hover:hover::before {
          left: 100%;
        }

        .card-hover:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15), 0 10px 20px rgba(168, 85, 247, 0.1);
        }
      `}</style>
    </div>
  );
}