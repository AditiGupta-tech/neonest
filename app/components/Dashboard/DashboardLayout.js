"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import WelcomeBanner from "./WelcomeBanner";
import BabyInfoCard from "./BabyInfoCard";
import QuickActionsGrid from "./QuickActionsGrid";
import StatsOverview from "./StatsOverview";
import RecentActivities from "./RecentActivities";
import { Baby } from "lucide-react";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Dummy data for demonstration
  const dummyBabies = [
    {
      id: 1,
      name: "Aarav",
      dateOfBirth: "2024-06-15",
      gender: "male",
      weight: "3.5 kg",
    },
    {
      id: 2,
      name: "Ananya",
      dateOfBirth: "2024-08-20",
      gender: "female",
      weight: "3.2 kg",
    },
  ];

  const dummyStats = {
    totalFeedings: 145,
    avgSleepHours: 14.5,
    vaccinesCompleted: 4,
    milestones: 8,
  };

  const dummyActivities = [
    {
      id: 1,
      type: "feeding",
      title: "Fed at 9:00 AM",
      description: "Breastfeeding - 20 minutes",
      time: "2 hours ago",
      icon: "utensils",
    },
    {
      id: 2,
      type: "sleep",
      title: "Nap completed",
      description: "Sleep duration: 2 hours",
      time: "3 hours ago",
      icon: "moon",
    },
    {
      id: 3,
      type: "milestone",
      title: "New milestone reached!",
      description: "First smile 😊",
      time: "1 day ago",
      icon: "star",
    },
    {
      id: 4,
      type: "medical",
      title: "Vaccine reminder",
      description: "DTP vaccine due in 3 days",
      time: "2 days ago",
      icon: "syringe",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Use real user data if available, otherwise use dummy data
  const userName = user?.name || "Parent";
  const babies = user?.BabyDet?.length > 0 ? user.BabyDet : dummyBabies;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner userName={userName} />

        {/* Baby Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {babies && babies.length > 0 ? (
            babies.map((baby, index) => (
              <BabyInfoCard key={baby.id || index} baby={baby} />
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <Baby className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No Baby Information Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add your baby&apos;s information to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Overview */}
        <StatsOverview stats={dummyStats} />

        {/* Quick Actions Grid */}
        <QuickActionsGrid />

        {/* Recent Activities */}
        <RecentActivities activities={dummyActivities} />
      </div>
    </div>
  );
}
