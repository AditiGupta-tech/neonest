import React, { useState, useEffect } from "react";
import { Clock, Utensils, Moon, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRecentActivities = async () => {
      if (!token) return;

      try {
        // Fetch recent feeding
        const feedingRes = await fetch('/api/feeding', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const feedingData = await feedingRes.json();
        const lastFeed = feedingData.feed?.[0];
        const feedActivity = lastFeed ? {
          type: "feeding",
          message: `Last fed: ${new Date(lastFeed.time).toLocaleString()}`,
          time: new Date(lastFeed.createdAt).toLocaleString(),
          icon: Utensils
        } : null;

        // Fetch recent sleep
        const sleepRes = await fetch('/api/sleep', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sleepData = await sleepRes.json();
        const lastSleep = sleepData?.[sleepData.length - 1];
        const sleepActivity = lastSleep ? {
          type: "sleep",
          message: `Baby slept: ${lastSleep.duration} (${lastSleep.type})`,
          time: new Date(lastSleep.createdAt).toLocaleString(),
          icon: Moon
        } : null;

        // Fetch recent memory (milestone)
        const memoryRes = await fetch('/api/memories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const memoryData = await memoryRes.json();
        const lastMemory = memoryData.memories?.[0];
        const memoryActivity = lastMemory ? {
          type: "milestone",
          message: `Memory uploaded: ${lastMemory.title}`,
          time: new Date(lastMemory.createdAt).toLocaleString(),
          icon: Activity
        } : null;

        const allActivities = [feedActivity, sleepActivity, memoryActivity].filter(Boolean);
        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchRecentActivities();
    const interval = setInterval(fetchRecentActivities, 60000); // Update every minute for real-time
    return () => clearInterval(interval);
  }, [token]);

  // Show sample activities even with no data for demonstration
  const sampleActivities = [
    {
      type: "feeding",
      message: "Last fed: 3 hrs ago",
      time: "",
      icon: Utensils,
      color: "text-blue-500"
    },
    {
      type: "sleep",
      message: "Baby slept: 6 hrs (Night sleep)",
      time: "",
      icon: Moon,
      color: "text-purple-500"
    },
    {
      type: "milestone",
      message: "Memory uploaded: First smile",
      time: "",
      icon: Activity,
      color: "text-green-500"
    }
  ];

  const displayActivities = activities.length > 0 ? activities : sampleActivities;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
      <div className="space-y-3 h-full">
        {displayActivities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <activity.icon className={`w-5 h-5 ${activity.color || 'text-blue-500'}`} />
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 min-h-[16px]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
