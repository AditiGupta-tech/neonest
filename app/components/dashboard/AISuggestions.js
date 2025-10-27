"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Sparkles, Lightbulb, AlertCircle, TrendingUp, Clock, Moon, Utensils } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AISuggestions() {
  const { token } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSuggestions();
  }, []);

  const generateSuggestions = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const smartSuggestions = [];

      let feedings = [];
      let sleepLogs = [];

      // Fetch feeding data
      try {
        const feedingRes = await axios.get("/api/feeding", { headers });
        feedings = feedingRes.data.feed || [];
      } catch (err) {
        console.log("Feeding data not available");
      }

      // Fetch sleep data
      try {
        const sleepRes = await axios.get("/api/sleep", { headers });
        sleepLogs = sleepRes.data || [];
      } catch (err) {
        console.log("Sleep data not available");
      }

      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Analyze feeding patterns
      const todayFeedings = feedings.filter(f => {
        const feedDate = new Date(f.createdAt || f.time).toISOString().split('T')[0];
        return feedDate === today;
      });

      if (todayFeedings.length === 0) {
        smartSuggestions.push({
          id: "no-feeding-today",
          title: "Log Today's Feeding",
          description: "You haven't logged any feedings today. Regular tracking helps identify patterns.",
          icon: Utensils,
          color: "from-pink-500 to-rose-500",
          bgColor: "bg-pink-50 dark:bg-pink-900/20",
          borderColor: "border-pink-200 dark:border-pink-800",
          priority: "high"
        });
      } else if (todayFeedings.length < 6) {
        smartSuggestions.push({
          id: "feeding-reminder",
          title: "Feeding Pattern Notice",
          description: `You've logged ${todayFeedings.length} feeding${todayFeedings.length > 1 ? 's' : ''} today. Newborns typically feed 8-12 times per day.`,
          icon: Lightbulb,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          priority: "medium"
        });
      }

      // Analyze sleep patterns
      const todaySleep = sleepLogs.filter(s => s.date === today);
      
      if (todaySleep.length === 0) {
        smartSuggestions.push({
          id: "no-sleep-today",
          title: "Track Sleep Today",
          description: "Don't forget to log your baby's sleep sessions for better pattern analysis.",
          icon: Moon,
          color: "from-indigo-500 to-purple-500",
          bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
          borderColor: "border-indigo-200 dark:border-indigo-800",
          priority: "high"
        });
      } else {
        // Calculate total sleep today
        const totalSleepHours = todaySleep.reduce((sum, s) => {
          const duration = s.duration || "";
          const hours = parseFloat(duration.match(/(\d+\.?\d*)\s*(hr|hour)/i)?.[1] || 0);
          const mins = parseFloat(duration.match(/(\d+)\s*(min|minute)/i)?.[1] || 0);
          return sum + hours + (mins / 60);
        }, 0);

        if (totalSleepHours < 10) {
          smartSuggestions.push({
            id: "low-sleep",
            title: "Sleep Duration Alert",
            description: `Your baby has slept ${totalSleepHours.toFixed(1)} hours today. Newborns need 14-17 hours of sleep per day.`,
            icon: AlertCircle,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
            borderColor: "border-orange-200 dark:border-orange-800",
            priority: "high"
          });
        } else if (totalSleepHours >= 14) {
          smartSuggestions.push({
            id: "good-sleep",
            title: "Excellent Sleep Pattern!",
            description: `Great job! Your baby has slept ${totalSleepHours.toFixed(1)} hours today, which is within the healthy range.`,
            icon: TrendingUp,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-800",
            priority: "low"
          });
        }
      }

      // Check growth tracking
      const growthLogs = JSON.parse(localStorage.getItem("growthLogs") || "[]");
      if (growthLogs.length === 0) {
        smartSuggestions.push({
          id: "start-growth",
          title: "Start Growth Tracking",
          description: "Begin tracking your baby's height and weight to monitor development milestones.",
          icon: TrendingUp,
          color: "from-green-500 to-teal-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          priority: "medium"
        });
      } else {
        const lastGrowthLog = growthLogs[growthLogs.length - 1];
        const daysSinceLastLog = Math.floor((new Date() - new Date(lastGrowthLog.date)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastLog > 14) {
          smartSuggestions.push({
            id: "update-growth",
            title: "Update Growth Measurements",
            description: `It's been ${daysSinceLastLog} days since your last growth log. Consider updating measurements.`,
            icon: Clock,
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            borderColor: "border-purple-200 dark:border-purple-800",
            priority: "medium"
          });
        }
      }

      // Check for consistent tracking
      const last7Days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      const trackedDays = last7Days.filter(date => 
        feedings.some(f => new Date(f.createdAt || f.time).toISOString().split('T')[0] === date) ||
        sleepLogs.some(s => s.date === date)
      ).length;

      if (trackedDays >= 5) {
        smartSuggestions.push({
          id: "consistent-tracking",
          title: "Great Tracking Consistency!",
          description: `You've tracked ${trackedDays} out of the last 7 days. Keep up the excellent work!`,
          icon: Sparkles,
          color: "from-yellow-500 to-amber-500",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          priority: "low"
        });
      }

      // Sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      smartSuggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setSuggestions(smartSuggestions.slice(0, 4)); // Show top 4 suggestions
      setLoading(false);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardContent className="p-6">
        {suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <div
                  key={suggestion.id}
                  className={`${suggestion.bgColor} ${suggestion.borderColor} border rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${suggestion.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No suggestions available</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Keep tracking to receive personalized AI insights
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span>Powered by AI • Updates in real-time based on your tracking data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
