"use client";

import { Clock, Utensils, Moon, Star, Syringe, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const iconMap = {
  utensils: Utensils,
  moon: Moon,
  star: Star,
  syringe: Syringe,
  activity: Activity,
};

const colorMap = {
  feeding: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    icon: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
  },
  sleep: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  milestone: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    icon: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
  },
  medical: {
    bg: "bg-red-50 dark:bg-red-900/20",
    icon: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  default: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    icon: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
};

export default function RecentActivities({ activities }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Recent Activities
        </h2>
        <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium transition-colors">
          View All →
        </button>
      </div>

      <Card className="border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => {
                const Icon = iconMap[activity.icon] || Activity;
                const colors = colorMap[activity.type] || colorMap.default;

                return (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${colors.border} ${colors.bg} hover:shadow-md transition-shadow duration-200`}
                  >
                    <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${colors.icon}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                <p className="text-gray-600 dark:text-gray-400">No recent activities</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Start tracking your baby&apos;s activities
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
