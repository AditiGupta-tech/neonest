"use client";

import { Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function WelcomeBanner({ userName }) {
  const { theme } = useTheme();
  const [greeting, setGreeting] = useState("Hello");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 18;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 dark:from-purple-900 dark:via-pink-800 dark:to-purple-900 p-8 shadow-2xl">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white dark:bg-gray-800 rounded-full opacity-10"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white dark:bg-gray-800 rounded-full opacity-10"></div>

      <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isDaytime ? (
              <Sun className="w-6 h-6 text-yellow-300 animate-pulse" />
            ) : (
              <Moon className="w-6 h-6 text-blue-200 animate-pulse" />
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {greeting}, {userName}!
            </h1>
          </div>
          <p className="text-purple-100 dark:text-purple-200 text-lg">
            Welcome to your parenting dashboard
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/20 dark:bg-gray-800/30 backdrop-blur-sm rounded-full px-4 py-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-medium">Your babies are growing!</span>
        </div>
      </div>

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: "2s" }}></div>
      </div>
    </div>
  );
}
