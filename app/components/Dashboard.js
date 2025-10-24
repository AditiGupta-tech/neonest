"use client";

import { useAuth } from "../context/AuthContext";
import RecentActivity from "./RecentActivity";
import FeedingTrendsChart from "./FeedingTrendsChart";
import SleepDurationsChart from "./SleepDurationsChart";
import GrowthTrackingChart from "./GrowthTrackingChart";
import Achievements from "./Achievements";
import AISuggestions from "./AISuggestions";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Personalization & Analytics Widgets
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity />
          <FeedingTrendsChart />
          <SleepDurationsChart />
          <GrowthTrackingChart />
          <Achievements />
          <AISuggestions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
