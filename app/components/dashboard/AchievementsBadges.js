"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Award, Trophy, Star, Target, Zap, Heart, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AchievementsBadges() {
  const { token } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateAchievements();
  }, []);

  const calculateAchievements = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const earnedAchievements = [];

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

      // Fetch memories
      try {
        const memoriesRes = await axios.get("/api/memories", { headers });
        const memories = memoriesRes.data || [];
        
        if (memories.length >= 1) {
          earnedAchievements.push({
            id: "first-memory",
            title: "First Memory Uploaded",
            description: "Captured your first precious moment",
            icon: Heart,
            color: "from-pink-500 to-rose-500",
            bgColor: "bg-pink-50 dark:bg-pink-900/20",
            borderColor: "border-pink-300 dark:border-pink-700",
            earned: true
          });
        }
      } catch (error) {
        console.log("Memories not available");
      }

      // Check for 3 days consistent sleep tracking
      const last3Days = [];
      for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last3Days.push(date.toISOString().split('T')[0]);
      }
      
      const hasConsistentSleep = last3Days.every(date => 
        sleepLogs.some(s => s.date === date)
      );

      if (hasConsistentSleep && sleepLogs.length >= 3) {
        earnedAchievements.push({
          id: "consistent-sleep",
          title: "3 Days Consistent Sleep Tracker",
          description: "Tracked sleep for 3 consecutive days",
          icon: Trophy,
          color: "from-indigo-500 to-purple-500",
          bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
          borderColor: "border-indigo-300 dark:border-indigo-700",
          earned: true
        });
      }

      // Check for 7 days feeding streak
      const last7Days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }
      
      const hasWeekStreak = last7Days.every(date => 
        feedings.some(f => {
          const feedDate = new Date(f.createdAt || f.time).toISOString().split('T')[0];
          return feedDate === date;
        })
      );

      if (hasWeekStreak && feedings.length >= 7) {
        earnedAchievements.push({
          id: "week-streak",
          title: "7-Day Feeding Streak",
          description: "Logged feedings for a full week",
          icon: Zap,
          color: "from-yellow-500 to-orange-500",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-300 dark:border-yellow-700",
          earned: true
        });
      }

      // Check for growth tracking
      const growthLogs = JSON.parse(localStorage.getItem("growthLogs") || "[]");
      if (growthLogs.length >= 3) {
        earnedAchievements.push({
          id: "growth-tracker",
          title: "Growth Monitoring Pro",
          description: "Logged 3+ growth measurements",
          icon: Target,
          color: "from-green-500 to-emerald-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-300 dark:border-green-700",
          earned: true
        });
      }

      // Check for 10+ total feedings
      if (feedings.length >= 10) {
        earnedAchievements.push({
          id: "feeding-master",
          title: "Feeding Master",
          description: "Logged 10+ feeding sessions",
          icon: Star,
          color: "from-blue-500 to-cyan-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-300 dark:border-blue-700",
          earned: true
        });
      }

      // Check for milestone achievements
      const checkedMilestones = JSON.parse(localStorage.getItem("checkedMilestones") || "{}");
      const milestoneCount = Object.values(checkedMilestones).filter(Boolean).length;
      
      if (milestoneCount >= 5) {
        earnedAchievements.push({
          id: "milestone-achiever",
          title: "Milestone Achiever",
          description: "Completed 5+ baby milestones",
          icon: Award,
          color: "from-purple-500 to-pink-500",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          borderColor: "border-purple-300 dark:border-purple-700",
          earned: true
        });
      }

      setAchievements(earnedAchievements);
      setLoading(false);
    } catch (error) {
      console.error("Error calculating achievements:", error);
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
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`${achievement.bgColor} ${achievement.borderColor} border-2 rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">
                          {achievement.title}
                        </h3>
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No achievements yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Keep tracking to unlock badges!
            </p>
            <div className="mt-6 space-y-2">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-left">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                  🎯 Upcoming Achievements:
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Log 3 consecutive days of sleep tracking</li>
                  <li>• Upload your first memory</li>
                  <li>• Track 10+ feeding sessions</li>
                  <li>• Complete 5 baby milestones</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
