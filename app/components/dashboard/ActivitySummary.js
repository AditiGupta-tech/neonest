"use client";

import { useState, useEffect } from "react";
import { Clock, Utensils, Moon, Baby, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ActivitySummary() {
  const { token } = useAuth();
  const [lastFeed, setLastFeed] = useState(null);
  const [lastSleep, setLastSleep] = useState(null);
  const [todayStats, setTodayStats] = useState({
    totalFeedings: 0,
    totalSleepHours: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch feeding data
      try {
        const feedingRes = await axios.get("/api/feeding", { headers });
        const feedings = feedingRes.data.feed || [];
        
        if (feedings.length > 0) {
          const sortedFeedings = feedings.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.time);
            const dateB = new Date(b.createdAt || b.time);
            return dateB - dateA;
          });
          setLastFeed(sortedFeedings[0]);
          
          // Count today's feedings
          const today = new Date().toISOString().split('T')[0];
          const todayFeedings = feedings.filter(f => {
            const feedDate = new Date(f.createdAt || f.time).toISOString().split('T')[0];
            return feedDate === today;
          });
          setTodayStats(prev => ({ ...prev, totalFeedings: todayFeedings.length }));
        }
      } catch (err) {
        console.log("Feeding data not available:", err.message);
      }

      // Fetch sleep data
      try {
        const sleepRes = await axios.get("/api/sleep", { headers });
        const sleepLogs = sleepRes.data || [];
        
        if (sleepLogs.length > 0) {
          const sortedSleep = sleepLogs.sort((a, b) => {
            const dateA = new Date(a.date + ' ' + a.time);
            const dateB = new Date(b.date + ' ' + b.time);
            return dateB - dateA;
          });
          setLastSleep(sortedSleep[0]);
          
          // Calculate today's total sleep
          const today = new Date().toISOString().split('T')[0];
          const todaySleep = sleepLogs.filter(s => s.date === today);
          const totalHours = todaySleep.reduce((sum, s) => {
            const duration = s.duration || "";
            const hours = parseFloat(duration.match(/(\d+\.?\d*)\s*(hr|hour)/i)?.[1] || 0);
            const mins = parseFloat(duration.match(/(\d+)\s*(min|minute)/i)?.[1] || 0);
            return sum + hours + (mins / 60);
          }, 0);
          setTodayStats(prev => ({ ...prev, totalSleepHours: totalHours }));
        }
      } catch (err) {
        console.log("Sleep data not available:", err.message);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity data:", error);
      setLoading(false);
    }
  };

  const getTimeSince = (dateString, timeString) => {
    try {
      let date;
      if (timeString) {
        date = new Date(dateString + ' ' + timeString);
      } else {
        date = new Date(dateString);
      }
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      if (diffHours > 0) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      if (diffMins > 0) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      return "Just now";
    } catch (error) {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Recent Activity Summary
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Last Fed */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-4 border border-pink-200 dark:border-pink-700 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Last Fed</p>
                <p className="text-lg font-bold text-pink-700 dark:text-pink-400">
                  {lastFeed ? getTimeSince(lastFeed.createdAt || lastFeed.time) : "No data"}
                </p>
              </div>
            </div>
            {lastFeed && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">{lastFeed.type}</span>
                {lastFeed.amount && <span> • {lastFeed.amount}</span>}
              </div>
            )}
          </div>

          {/* Last Sleep */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-700 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Last Sleep</p>
                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                  {lastSleep ? getTimeSince(lastSleep.date, lastSleep.time) : "No data"}
                </p>
              </div>
            </div>
            {lastSleep && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">{lastSleep.duration || "N/A"}</span>
                {lastSleep.type && <span> • {lastSleep.type}</span>}
              </div>
            )}
          </div>

          {/* Today's Feedings */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Today's Feedings</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                  {todayStats.totalFeedings} times
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span className="font-semibold">Keep tracking!</span>
            </div>
          </div>

          {/* Today's Sleep */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Total Sleep Today</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                  {todayStats.totalSleepHours.toFixed(1)} hrs
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span className="font-semibold">
                {todayStats.totalSleepHours >= 12 ? "Great sleep!" : "Keep monitoring"}
              </span>
            </div>
          </div>
        </div>

        {/* No Data Message */}
        {!lastFeed && !lastSleep && (
          <div className="text-center py-8">
            <Baby className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No activity data yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Start tracking your baby's feeding and sleep to see insights here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
