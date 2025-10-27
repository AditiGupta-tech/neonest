"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import LoginPrompt from "../components/LoginPrompt";
import ActivitySummary from "../components/dashboard/ActivitySummary";
import FeedingChart from "../components/dashboard/FeedingChart";
import SleepChart from "../components/dashboard/SleepChart";
import GrowthChart from "../components/dashboard/GrowthChart";
import AchievementsBadges from "../components/dashboard/AchievementsBadges";
import AISuggestions from "../components/dashboard/AISuggestions";
import { LayoutDashboard, TrendingUp, Award, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function DashboardPage() {
  const { isAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    document.title = "Dashboard | NeoNest";
    setLoading(false);
  }, []);

  // Auto-refresh every 5 minutes for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      setLastRefresh(new Date());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLastRefresh(new Date());
  };

  // Removed login requirement - dashboard is now accessible to everyone
  // if (!isAuth) {
  //   return <LoginPrompt sectionName="dashboard" />;
  // }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-400 dark:bg-pink-300 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-purple-400 dark:bg-purple-300 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 right-10 w-1 h-1 bg-pink-300 rounded-full animate-pulse opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 min-h-screen">
        {/* Header with Refresh Button */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Your Baby Care Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  Track, analyze, and optimize your baby's care routine
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Button 
                onClick={handleManualRefresh}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Summary Widget */}
        <div className="mb-6 animate-slide-up">
          <ActivitySummary key={`activity-${refreshKey}`} />
        </div>

        {/* Charts Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Analytics & Trends</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              <FeedingChart key={`feeding-${refreshKey}`} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              <SleepChart key={`sleep-${refreshKey}`} />
            </div>
          </div>
          <div className="mt-6 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
            <GrowthChart key={`growth-${refreshKey}`} />
          </div>
        </div>

        {/* Achievements and AI Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Achievements</h2>
            </div>
            <AchievementsBadges key={`achievements-${refreshKey}`} />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Suggestions</h2>
            </div>
            <AISuggestions key={`suggestions-${refreshKey}`} />
          </div>
        </div>
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

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
