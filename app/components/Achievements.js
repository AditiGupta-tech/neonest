import React, { useState, useEffect } from "react";
import { Trophy, Star, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!token) return;

      try {
        // Fetch data to determine achievements
        const [feedingRes, sleepRes, memoryRes] = await Promise.all([
          fetch('/api/feeding', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/sleep', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/memories', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const feedingData = await feedingRes.json();
        const sleepData = await sleepRes.json();
        const memoryData = await memoryRes.json();

        const feeds = feedingData.feed || [];
        const sleeps = sleepData || [];
        const memories = memoryData.memories || [];

        // Calculate achievements based on data
        const achievementsList = [
          {
            title: "3 Days Consistent Sleep Tracker",
            icon: Trophy,
            unlocked: sleeps.length >= 3,
            description: sleeps.length >= 3 ? "You've been tracking sleep for 3+ days!" : "Track sleep for 3 consecutive days"
          },
          {
            title: "First Memory Uploaded",
            icon: Star,
            unlocked: memories.length > 0,
            description: memories.length > 0 ? "You've uploaded your first memory!" : "Upload your first memory"
          }
        ];

        setAchievements(achievementsList);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
    const interval = setInterval(fetchAchievements, 3600000); // Update hourly
    return () => clearInterval(interval);
  }, [token]);

  // Show sample achievements even with no data
  const sampleAchievements = [
    {
      title: "3 Days Consistent Sleep Tracker",
      icon: Trophy,
      unlocked: false,
      description: "Track sleep for 3 consecutive days"
    },
    {
      title: "First Memory Uploaded",
      icon: Star,
      unlocked: false,
      description: "Upload your first memory"
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : sampleAchievements;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Achievements</h3>
      <div className="space-y-3">
        {displayAchievements.map((achievement, index) => (
          <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${achievement.unlocked ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-gray-50 dark:bg-gray-700'}`}>
            <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div>
              <p className={`text-sm font-medium ${achievement.unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {achievement.title}
              </p>
              {!achievement.unlocked && <p className="text-xs text-gray-400">Not yet unlocked</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
